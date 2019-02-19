module.exports = app => {
    const { existsOrError, notExistsOrError, numberOrError } = app.api.validation

    const save = (req, res) => {
        const store = { ...req.body }
        if(req.params.id) store.id = req.params.id

        try {
            existsOrError(store.name, "Name cannot be blank")
            existsOrError(store.description, "Description cannot be blank")
            existsOrError(store.imageUrl, "Logo cannot be blank")
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(store.id) {
            app.db('stores')
                .update(store)
                .where({ id: store.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('stores')
                .insert(store)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            numberOrError(req.params.id, "ID not valid.")

            const lists = await app.db('lists')
                .where({ storeId: req.params.id })
                notExistsOrError(lists, 'Store ID is attached to some lists. Cannot be removed.')
                
            const rowsDeleted = await app.db('stores')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Store not found.')
            
            res.status(204).send()
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('stores')
            .then(stores => res.json(stores))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        try {
            numberOrError(req.params.id, 'ID not valid.')
            app.db('stores')
                .select('id', 'name', 'description', 'imageUrl')
                .where({ id: req.params.id }).first()
                .then(store => res.json(store))
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    return { save, remove, get, getById }
}