const queries = require('./queries')

module.exports = app => {
    const { existsOrError, notExistsOrError, numberOrError } = app.api.validation
    const { getByList } = app.api.listItems
    
    const save = (req, res) => {
        const list = { ...req.body }
        if(req.params.id) list.id = req.params.id

        try {
            existsOrError(list.storeId, 'Store not selected')
            existsOrError(list.userId, 'User ID not valid')
            existsOrError(list.listItems, 'List must have items.')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(list.id) {
            app.db('lists')
                .update(list)
                .where({ id: list.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('lists')
                .insert(list)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
        const remove = async (req, res) => {
            try {
                numberOrError(req.params.id, "ID not valid.")
    
                const listPicker = await app.db('list')
                    .select('pickerId')
                    .where({ id: req.params.id })
                    notExistsOrError(listPicker, 'List cannot be deleted. A picker has picked it.')
                
                const rowsDeleted = await app.db('lists')
                .where({ id: req.params.id }).del()
                
                try {
                    existsOrError(rowsDeleted, 'List not found.')
                } catch(msg) {
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
                .then(lists => res.json({ data: lists, count, limit }))
                .catch(err => res.status(500).send(err))
        }
    
        const getById = (req, res) => {
            let listItems;
            try {
                numberOrError(req.params.id, 'ID not valid.')
                app.db('listItems')
                    .where({ id: req.params.id })
                    .then(listItems => listItems)
                    .catch(err => res.status(500).send(err))
            } catch(msg) {
                return res.status(400).send(msg)
            }

            try {
                numberOrError(req.params.id, 'ID not valid.')
                app.db('lists')
                    .where({ id: req.params.id }).first()
                    //.then(list => res.json(list['listItems'].push(listItems)))
                    .then(list => res.json(list))
                    .catch(err => res.status(500).send(err))
            } catch(msg) {
                return res.status(400).send(msg)
            }
        }

    
        return { save, remove, get, getById}
}