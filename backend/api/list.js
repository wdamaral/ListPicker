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
        const list = {
            ...req.body
        }
        list.ownerId = 1
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

        if (listFromDb.get('pickerId') === 1) {
            let items = _.map(list.listItems, item => _.pick(item, ['id', 'price']))
            let body = _.pick(req.body, ['receiptNumber'])

            app.bookshelf.transaction(t => {
                return List
                    .where('id', list.id)
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
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

        } else if (listFromDb.get('ownerId') === 1) {
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
                        .where('id', list.id)
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
        try {
            isValidID(req.params.id, "ID not valid.")

            const listPicker = await List
                .fetch('pickerId')
                .where({
                    id: req.params.id
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

    const limit = 10 //pagination
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('lists')
            .count('id')
            .first()

        const count = parseInt(result.count)

        app.db('lists')
            .select('id', 'totalItems', 'storeId', 'userId', 'pickerId')
            .limit(limit).offset(page * limit - limit)
            .then(lists => res.json({
                data: lists,
                count,
                limit
            }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        let listItems;
        try {
            isValidID(req.params.id, 'ID not valid.')
            app.db('listItems')
                .where({
                    id: req.params.id
                })
                .then(listItems => listItems)
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }

        try {
            isValidID(req.params.id, 'ID not valid.')
            app.db('lists')
                .where({
                    id: req.params.id
                }).first()
                //.then(list => res.json(list['listItems'].push(listItems)))
                .then(list => res.json(list))
                .catch(err => res.status(500).send(err))
        } catch (msg) {
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