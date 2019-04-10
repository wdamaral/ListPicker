module.exports = app => {
    const {
        existsOrError,
        notExistsOrError,
        isValidID
    } = app.api.validation
    const {
        Store,
        List
    } = app.models.index
    const {
        moveFile
    } = app.api.imageUpload

    const insert = (req, res) => {
        const store = {
            ...req.body.store
        }
        const uploads = req.body.uploads

        if (req.params.id) store.id = req.params.id

        try {
            existsOrError(store.name, 'Name cannot be blank')

            const store = Store.forge({
                name: store.name
            }).fetch()

            notExistsOrError(store, 'This store is already registered.')

        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (uploads > 0) {
            app.bookshelf.transaction(t => {
                    let pic = store.imageUrl
                    let saveStore = new Store(store).save(null, {
                        transacting: t
                    })
                    let movePic = moveFile(pic, 'stores')
                    return Promise.all([saveStore, movePic])
                })
                .then(_ => res.status(204).send())
                .catch(err => {
                    console.log(err)
                    return res.status(500).send(err)
                })
        } else {

            Store
                .forge()
                .save(store)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }

    }

    const update = (req, res) => {
        const store = {
            ...req.body.store
        }
        const uploads = req.body.uploads

        if (req.params.id) store.id = req.params.id

        try {
            existsOrError(store.name, 'Name cannot be blank')
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (store.id) {
            try {
                isValidID(store.id, 'ID not valid.')

            } catch (msg) {
                return res.status(400).send(msg)
            }

            if (uploads > 0) {
                return app.bookshelf.transaction(t => {
                        let pic = store.imageUrl
                        let saveStore = new Store(store)
                            .save(null, {
                                transacting: t
                            })
                        let movePic = moveFile(pic, 'stores')
                        return Promise.all([saveStore, movePic])
                    })
                    .then(_ => res.status(204).send())
                    .catch(err => {
                        console.log(err)
                        return res.status(500).send(err)
                    })

            } else {
                return Store
                    .forge()
                    .save(store, {
                        method: 'update'
                    })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }

        }
    }

    const remove = async (req, res) => {
        try {
            isValidID(req.params.id, 'ID not valid.')

            const lists = await List
                .where({
                    storeId: req.params.id
                })
                .fetch()
            notExistsOrError(lists, 'Store ID is attached to some lists. Cannot be removed.')

            const rowsDeleted = await Store
                .where({
                    id: req.params.id
                })
                .destroy()
            existsOrError(rowsDeleted, 'Store not found.')

            return res.status(204).send()
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        const page = req.query.page || 1
        Store
            .query(qb => qb)
            .fetchPage({
                pageSize: 10,
                page
            })
            .then(stores => res.json({
                stores,
                pagination: stores.pagination
            }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        try {
            isValidID(req.params.id, 'ID not valid.')
            Store
                .where({
                    id: req.params.id
                })
                .fetch({
                    columms: ['id', 'name', 'description', 'imageUrl']
                })
                .then(store => res.json(store))
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    return {
        insert,
        update,
        remove,
        get,
        getById
    }
}