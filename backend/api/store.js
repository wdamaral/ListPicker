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
    const save = (req, res) => {
        const store = {
            ...req.body
        }
        if (req.params.id) store.id = req.params.id

        try {
            existsOrError(store.name, "Name cannot be blank")
            existsOrError(store.description, "Description cannot be blank")
            existsOrError(store.imageUrl, "Logo cannot be blank")
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (store.id) {
            try {
                isValidID(store.id, 'ID not valid.')

            } catch (msg) {
                return res.status(400).send(msg)
            }
            Store
                .forge()
                .save(store, {
                    method: 'update'
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            Store
                .forge()
                .save(store, {
                    method: 'insert'
                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            isValidID(req.params.id, "ID not valid.")

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
        save,
        remove,
        get,
        getById
    }
}