const Promise = require('bluebird')
const _ = require('lodash')

module.exports = app => {
    const {
        existsOrError,
        notExistsOrError,
        isValidID,
        isNumber,
        differentOrError,
        equalsOrError
    } = app.api.validation
    const {
        List,
        ListItem,
        User
    } = app.models.index

    const save = (req, res) => {
        const user = {
            ...req.user
        }
        // console.log(user)
        const list = {
            ...req.body
        }
        list.ownerId = user.id
        if (req.params.id) list.id = req.params.id
        try {
            existsOrError(list.storeId, 'Store not selected.')
            existsOrError(list.ownerId, 'Owner ID is not valid.')
            isValidID(list.ownerId, 'Owner ID is not valid.')
            existsOrError(list.listItems, 'List must have items.')
            for (let item of list.listItems) {
                existsOrError(item.item, 'Invalid product name.')
                existsOrError(item.quantity, `${item.item}: Quantity is invalid`)
                isNumber(item.quantity, `${item.item}: Quantity is invalid.`)
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        let listItems = list.listItems
        delete list.listItems
        list.totalItems = listItems.length
        app.bookshelf.transaction(t => {
                return new List(list)
                    .save(null, {
                        transacting: t
                    })
                    .tap(list => {
                        return Promise.map(listItems, (item) =>
                            new ListItem(item)
                            .save({
                                'listId': list.id
                            }, {
                                transacting: t
                            })
                        )
                    })
            })
            .then(_ => res.status(200).send('List created successfully.'))
            .catch(err => {
                // console.log(err)
                return res.status(500).send(err)
            })
    }

    const saveReceipt = async (req, res) => {
        const user = {
            ...req.user
        }

        const listFromBody = {
            ...req.body
        }

        listFromBody.id = req.params.id
        try {

            const list = await List
                .forge({
                    id: listFromBody.id
                }).fetch()

            equalsOrError(list.get('pickerId'), user.id, 'You cannot edit this list.')
            existsOrError(list, 'List not found.')
            return List.forge({
                    id: list.id
                }).save({
                    receiptNumber: listFromBody.receiptNumber
                }, {
                    method: 'update'
                })
                .then(_ => res.status(200).send('List receipt updated.'))
                .catch(err => {
                    // console.log(err)
                    return res.status(500).send(err)
                })
        } catch (msg) {
            return res.status(400).send(msg)
        }

    }

    const edit = async (req, res) => {
        const user = {
            ...req.user
        }

        const list = {
            ...req.body
        }

        // console.log(list)
        delete list.owner
        delete list.picker
        delete list.store

        list.id = req.params.id
        let listFromDb
        try {
            listFromDb = await new List({
                id: list.id
            }).fetch({
                columns: ['ownerId', 'pickerId']
            })
            if (!listFromDb) {
                return res.status(400).send('No lists found.')
            }
        } catch (err) {
            return res.status(500).send(err)
        }

        if (listFromDb.get('pickerId') === user.id) {
            let items = _.map(list.listItems, item => _.pick(item, ['id', 'cost']))
            let body = _.pick(req.body, ['receiptNumber'], item.reduce((a, b) => a + b))
            let cost;
            try {
                for (let item of items) {
                    isNumber(item.cost, 'Final cost is invalid')
                }
            } catch (msg) {
                return res.status(400).send(msg)
            }
            app.bookshelf.transaction(t => {
                    return List
                        .where({
                            'id': list.id,
                            pickerId: user.id
                        })
                        .save(body, {
                            method: 'update',
                            patch: true,
                            transacting: t
                        })
                        .tap(body => {
                            return Promise.map(items, (item) =>
                                new ListItem(item)
                                .save({
                                    'listId': list.id
                                }, {
                                    transacting: t
                                })
                            )
                        })
                        .then()
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))

        } else if (listFromDb.get('ownerId') === user.id) {
            if (listFromDb.get('pickerId')) return res.status(403).send('List is already picked. You cannot edit.')
            let body = _.pick(req.body, ['storeId'])
            let itemsFromBody = [...req.body.listItems]


            try {
                existsOrError(body.storeId, 'Store not selected.')
                existsOrError(itemsFromBody, 'List must have items.')
                for (let item of itemsFromBody) {
                    existsOrError(item.item, 'Invalid product name.')
                    existsOrError(item.quantity, `${item.item}: Quantity is invalid`)
                    isNumber(item.quantity, `${item.item}: Quantity is invalid.`)
                }
            } catch (msg) {
                return res.status(400).send(msg)
            }

            app.bookshelf.transaction(t => {
                    return List
                        .where({
                            'id': list.id,
                            'ownerId': user.id
                        })
                        .save(body, {
                            method: 'update',
                            patch: true,
                            transacting: t
                        })
                        .tap(body => {
                            return Promise.map(itemsFromBody, (item) =>
                                new ListItem(item)
                                .save({
                                    'listId': list.id
                                }, {
                                    transacting: t
                                })
                            )
                        })
                })
                .then(_ => res.status(200).send('List updated succesfully.'))
                .catch(err => res.status(500).send(err))
        } else {
            if (listFromDb.get('pickerId')) return res.status(403).send('You cannot edit lists that have already been picked.')
            return res.status(403).send('You are neither the owner nor the picker of this list.')
        }
    }
    const confirmDelivery = async (req, res) => {
        const user = {
            ...req.user
        }
        const SITE_COST = 5

        let list

        const {
            putMoney,
            removeMoney,
        } = app.api.wallet
        const {
            makePayment
        } = app.api.transaction

        try {
            isValidID(req.params.id, "ID not valid.")

            list = await new List({
                id: req.params.id,
                ownerId: user.id,
                isBought: true,
                isDelivered: true,
            }).fetch()



            existsOrError(list, 'List cannot be confirmed yet. It might not be delivered.')
            notExistsOrError(list.get('isConfirmed'), 'List is already confirmed.')

        } catch (msg) {
            return res.status(400).send(msg)
        }

        return app.bookshelf.transaction(function (t) {
                const listUpdated = List
                    .forge({
                        id: list.id,
                        ownerId: list.ownerId
                    })
                    .save({
                        isConfirmed: true,
                        confirmedAt: new Date(Date.now())
                    }, {
                        transacting: t
                    })
                console.log(list.get('totalCost') * 1)
                const transactionAmount = SITE_COST + (list.get('totalCost') * 1)
                const takeMoney = removeMoney(transactionAmount, user.id, t)
                const depositMoney = putMoney(transactionAmount, list.get('pickerId'), t)
                const transac = makePayment(list.get('pickerId'), user.id, transactionAmount, t)

                return Promise.all([listUpdated, takeMoney, depositMoney, transac])
            })
            .then(_ => res.status(200).send('Delivery confirmed and picker paid.'))
            .catch(err => {
                // console.log(err)
                return res.status(500).send(err)
            })

    }

    const deliver = async (req, res) => {
        const user = {
            ...req.user
        }

        let list
        try {
            isValidID(req.params.id, "ID not valid.")
            list = await new List({
                    id: req.params.id,
                    pickerId: user.id,
                    isBought: true,
                    isDelivered: false
                })
                .fetch()


            existsOrError(list, 'You cannot edit the status of this list.')

            try {
                existsOrError(list.get('receiptNumber'), 'Please, update the receipt number first.')
            } catch (msg) {
                return res.status(400).send(msg)
            }
        } catch (msg) {
            return res.status(403).send(msg)
        }

        List
            .forge({
                id: list.id,
                pickerId: list.pickerId,
                isBought: true,
                isDelivered: false
            })
            .save({
                isDelivered: true,
                deliveredAt: new Date(Date.now())
            }, {
                method: 'update',
                patch: true
            })
            .then(_ => res.status(200).send('List status updated to Delivered.'))
            .catch(err => res.status(500).send(err))
    }

    const markBought = async (req, res) => {
        const user = {
            ...req.user
        }
        let list
        let total
        try {
            isValidID(req.params.id, "ID not valid.")
            // console.log('here')

            list = await List.forge({
                id: req.params.id,
                pickerId: user.id,
                isBought: false
            }).fetch({
                withRelated: 'listItems'
            })

            existsOrError(list, 'You cannot edit the status of this list.')
            total = 0
            try {
                for (const listItem of list.related('listItems')) {
                    existsOrError(listItem.get('cost'), 'All items must have a price.')
                    existsOrError(listItem.get('qtyBought'), 'All items must have the quantity bought.')
                    total += listItem.get('cost') * 1
                }
                existsOrError(list.get('receiptNumber'), 'Please, update the receipt number first.')
            } catch (msg) {
                return res.status(400).send(msg)
            }

        } catch (msg) {
            return res.status(403).send(msg)
        }

        // console.log(total)
        List
            .forge({
                id: list.id,
                pickerId: list.pickerId
            })
            .save({
                isBought: true,
                boughtAt: new Date(Date.now()),
                totalCost: total
            })
            .then(_ => res.status(200).send('List status updated to Items bought.'))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        const user = req.user
        try {
            isValidID(req.params.id, "ID not valid.")

            const listPicker = await List
                .where({
                    id: req.params.id,
                    ownerId: user.id
                })
                .fetch({
                    columns: 'pickerId'
                })
            notExistsOrError(listPicker.get('id'), 'List cannot be deleted. A picker has picked it.')

            const rowsDeleted = await new List({
                id: req.params.id
            }).destroy()

            try {
                notExistsOrError(rowsDeleted.message, 'List not found.')
            } catch (msg) {
                return res.status(400).send(msg)
            }
            res.status(200).send('List removed.')
        } catch (msg) {
            return res.status(500).send(msg)
        }
    }

    const get = async (req, res) => {
        const page = req.query.page || 1

        List
            .query(qb => qb.where({
                pickerId: null
            }))
            .fetchPage({
                withRelated: ['store',
                    {
                        'owner': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    },
                    {
                        'picker': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    }
                ],
                columns: ['id', 'totalItems', 'createdAt', 'updatedAt', 'storeId', 'ownerId', 'pickerId'],
                pageSize: 12,
                page
            })
            .then(lists => res.status(200).json({
                lists,
                pagination: lists.pagination
            }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        //console.log(req)
        try {
            isValidID(req.params.id, 'ID not valid.')
            List
                .where('id', req.params.id)
                .fetch({
                    withRelated: ['listItems', 'store',
                        {
                            'owner': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                        },
                        {
                            'picker': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                        },
                    ]
                })
                .then(list => {
                    return res.status(200).json(list)
                })
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const validateList = (req, res) => {
        //console.log(req)
        try {
            isValidID(req.params.id, 'ID not valid.')
            List
                .where('id', req.params.id)
                .fetch({
                    columns: ['ownerId', 'pickerId']
                })
                .then(list => {
                    console.log(list)
                    return res.status(200).send(list)
                })
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const getHistoryByUserId = (req, res) => {
        const page = req.query.page || 1
        const user = req.user
        List
            .query(qb => {
                qb.where({
                    ownerId: user.id,
                    isConfirmed: true
                })
                qb.orWhere({
                    pickerId: user.id,
                    isConfirmed: true
                })
            })
            .fetchPage({
                withRelated: ['store',
                    {
                        'owner': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    },
                    {
                        'picker': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    }
                ],
                columns: ['id', 'totalItems', 'createdAt', 'updatedAt', 'storeId', 'ownerId', 'pickerId'],
                pageSize: 10,
                page
            })
            .then(lists => res.status(200).json({
                lists,
                pagination: lists.pagination
            }))
            .catch(err => res.status(500).send(err))
    }

    const getPickedByUserId = (req, res) => {
        const page = req.query.page || 1
        const user = req.user
        List
            .query(qb => {
                qb.where({
                    pickerId: user.id,
                    isConfirmed: false
                })
            })
            .fetchPage({
                withRelated: ['store',
                    {
                        'owner': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    },
                    {
                        'picker': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    }
                ],
                columns: ['id', 'totalItems', 'createdAt', 'updatedAt', 'storeId', 'ownerId', 'pickerId'],
                pageSize: 10,
                page
            })
            .then(lists => res.status(200).json({
                lists,
                pagination: lists.pagination
            }))
            .catch(err => res.status(500).send(err))
    }

    const getOwnedByUserId = (req, res) => {
        const page = req.query.page || 1
        const user = req.user
        console.log('entrou')

        List
            .query(qb => {
                qb.where({
                    ownerId: user.id,
                    isConfirmed: false
                })
            })
            .fetchPage({
                withRelated: ['store',
                    {
                        'owner': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    },
                    {
                        'picker': qb => qb.select('firstName', 'latitude', 'longitude', 'profilePicture', 'id')
                    }
                ],
                columns: ['id', 'totalItems', 'createdAt', 'updatedAt', 'storeId', 'ownerId', 'pickerId'],
                pageSize: 10,
                page
            })
            .then(lists => res.status(200).json({
                lists,
                pagination: lists.pagination
            }))
            .catch(err => res.status(500).send(err))
    }

    const pickList = async (req, res) => {
        const user = req.user
        const listId = req.params.listId

        try {
            existsOrError(listId, 'List not selected')
            existsOrError(user, 'User not registered')
            const list = await List
                .forge({
                    id: listId
                })
                .fetch()

            existsOrError(list, 'List not found.')
            notExistsOrError(list.get('pickerId'), 'This listed is already picked')

            try {
                differentOrError(list.get('ownerId'), user.id, 'Owner cannot pick the list')
            } catch (msg) {
                return res.status(403).send(msg)
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        List
            .forge({
                id: listId
            })
            .save({
                pickerId: user.id,
                pickedAt: new Date(Date.now())
            }, {
                method: 'update',
                patch: true
            })
            .then(_ => res.status(200).send())
            .catch(err => res.status(500).send(err))

    }

    return {
        save,
        edit,
        remove,
        get,
        getById,
        confirmDelivery,
        deliver,
        getHistoryByUserId,
        getPickedByUserId,
        getOwnedByUserId,
        markBought,
        pickList,
        saveReceipt,
        validateList
    }
}