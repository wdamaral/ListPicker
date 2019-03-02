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
        ListItem
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
            .catch(err => res.status(500).send(err))
    }

    const edit = async (req, res) => {
        const user = req.user
        // console.log(req.body)
        const list = {
            ...req.body
        }
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
            let body = _.pick(req.body, ['receiptNumber'], item.reduce((a,b) => a+b))
            let cost;
            try {
                for(let item of items) {
                    isNumber(item.cost, 'Final cost is invalid')
                }
            } catch (msg) {
                return res.status(400).send(msg)
            }
            app.bookshelf.transaction(t => {
                return List
                    .where({'id': list.id, pickerId: user.id})
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
                        .where({'id': list.id, 'ownerId': user.id})
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


    const remove = async (req, res) => {
        const user = req.user
        try {
            isValidID(req.params.id, "ID not valid.")

            const listPicker = await List
                .fetch('pickerId')
                .where({
                    id: req.params.id,
                    ownerId: user.id
                })
            notExistsOrError(listPicker, 'List cannot be deleted. A picker has picked it.')

            const rowsDeleted = await new List({
                id: req.params.id
            }).destroy()

            try {
                existsOrError(rowsDeleted.message, 'List not found.')
            } catch (msg) {
                return res.status(400).send(msg)
            }
            res.status(204).send()
        } catch (msg) {
            return res.status(500).send(msg)
        }
    }
    
    const get = async (req, res) => {
        const page = req.query.page || 1

        List
            .query(qb => qb)
            .fetchPage({columns: ['id', 'totalItems', 'storeId', 'ownerId', 'pickerId'], pageSize: 10, page })
            .then(lists => res.status(200).json({lists, pagination: lists.pagination}))
            .catch(err => {
                console.log(err)
                return res.status(500).send(err)})
    }

    const getById = (req, res) => {
        //console.log(req)
        try {
            isValidID(req.params.id, 'ID not valid.')
            List
                .where('id', req.params.id)
                .fetch({withRelated: 'listItems'})
                .then(list => { 
                    if(list) {
                        return res.status(200).json(list)
                    }
                    return res.status(204).send()  
                })
                .catch(err => res.status(500).send(err))
        }catch(msg) {
            return res.status(400).send(msg)
        }
    }


    return {
        save,
        edit,
        remove,
        get,
        getById
    }
}