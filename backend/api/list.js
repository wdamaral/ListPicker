const Promise = require('bluebird')
const _ = require('lodash')

module.exports = app => {
    const {
        existsOrError,
        notExistsOrError,
        isValidID,
        isNumber
    } = app.api.validation
    const {
        List,
        ListItem,
        User
    } = app.models.index

    const save = (req, res) => {
        const user = req.user
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
        console.log(listItems)
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
            .then(_ => res.status(204).send())
            .catch(err => {
                console.log(err)
                return res.status(500).send(err)
            })
    }

    const edit = async (req, res) => {
        const user = req.user
        // console.log(req.body)
        const list = {
            ...req.body
        }
        delete list.owner
        delete list.picker
        delete list.store

        list.id = req.params.id
        let listFromDb
        try {
            listFromDb = await new List({
                'id': list.id
            }).fetch({
                columns: ['ownerId', 'pickerId']
            })
            if (!listFromDb) {
                return res.status(204).send('No lists found.')
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
            let body = _.pick(req.body, ['storeId'])
            let itemsFromBody = req.body.listItems

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
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            if (listFromDb.get('pickerId')) return res.status(400).send('You cannot edit lists that have already been picked.')
            return res.status(400).send('You are neither the owner nor the picker of this list.')
        }
    }
    const confirmDelivery = async (req, res) => {

        // const user = req.user
        const user = {
            id: 1
        }

        try {
            isValidID(req.params.id, "ID not valid.")
            const list = await new List({
                    id: req.params.id,
                    ownerId: user.id
                })
                .query(qb => {
                    qb.havingNotNull('deliveredAt')
                    qb.groupBy('id')
                })
                .fetch()
            existsOrError(list, 'List not found or not delivered yet.')

            List
                .forge({
                    id: list.id,
                    ownerId: list.ownerId
                })
                .save({
                    confirmedAt: new Date(Date.now())
                })
                .then(_ => res.status(200).send())
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const deliver = async (req, res) => {

        // const user = req.user
        const user = {
            id: 2
        }

        try {
            isValidID(req.params.id, "ID not valid.")
            const list = await new List({
                    id: req.params.id,
                    pickerId: user.id
                })
                .fetch()
            console.log(list)

            existsOrError(list, 'List not found.')

            List
                .forge({
                    id: list.id,
                    pickerId: list.pickerId
                })
                .save({
                    deliveredAt: new Date(Date.now())
                })
                .then(_ => res.status(200).send())
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
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
                .fetch({columns: 'pickerId'})
            notExistsOrError(listPicker.get('id'), 'List cannot be deleted. A picker has picked it.')

            const rowsDeleted = await new List({
                id: req.params.id
            }).destroy()

            try {
                notExistsOrError(rowsDeleted.message, 'List not found.')
            } catch (msg) {
                return res.status(400).send(msg)
            }
            res.status(204).send()
        } catch (msg) {
            console.log(msg)
            return res.status(500).send(msg)
        }
    }

    const get = async (req, res) => {
        const page = req.query.page || 1

        List
            .query(qb => qb)
            .fetchPage({
                columns: ['id', 'totalItems', 'storeId', 'ownerId', 'pickerId'],
                pageSize: 10,
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
                .catch(err => console.log(err))
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
                    ownerId: user.id
                })
                qb.orWhere({
                    pickerId: user.id
                })
                qb.havingNotNull('confirmedAt')
                qb.groupBy('id')
            })
            .fetchPage({
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
                    pickerId: user.id
                })
            })
            .fetchPage({
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
        List
            .query(qb => {
                qb.where({
                    ownerId: user.id
                })
            })
            .fetchPage({
                pageSize: 10,
                page
            })
            .then(lists => res.status(200).json({
                lists,
                pagination: lists.pagination
            }))
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
        getOwnedByUserId
    }
}