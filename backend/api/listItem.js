module.exports = app => {
    const { existsOrError, isValidID } = app.api.validation

    const save = (req, res) => {
        const listItem = { ...req.body }
        if(req.params.id) listItem.id = req.params.id

        try {
            existsOrError(listItem.item, 'Item cannot be blank.')
            existsOrError(listItem.quantity, 'Quantity cannot be blank.')
            existsOrError(listItem.unit, 'Unit cannot be blank.')
            existsOrError(listItem.listId, 'List ID not valid')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(list.id) {
            app.db('listItems')
                .update(listItem)
                .where({ id: listItem.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('listItems')
                .insert(listItem)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
        const remove = async (req, res) => {
            try {
                numberOrError(req.params.id, "ID not valid.")
    
                const rowsDeleted = await app.db('listItem')
                .where({ id: req.params.id }).del()
                
                try {
                    existsOrError(rowsDeleted, 'Item not found.')
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
                .where({ listId: req.params.id })
                .first()
            
            const count = parseInt(result.count)

            app.db('lists')
                .select('id', 'totalItems', 'storeId', 'userId', 'pickerId')
                .limit(limit).offset(page * limit - limit)
                .then(lists => res.json({ data: lists, count, limit }))
                .catch(err => res.status(500).send(err))
        }
    
        // const getById = (req, res) => {
        //     try {
        //         numberOrError(req.params.id, 'ID not valid.')
        //         app.db('lists')
        //             .where({ id: req.params.id }).first()
        //             .then(list => res.json(list))
        //             .catch(err => res.status(500).send(err))
        //     } catch(msg) {
        //         return res.status(400).send(msg)
        //     }
        // }

        const getByListId = (req, res) => {
            const listId = req.params.id
            const page = req.query.page || 1

            try {
                isValidID(listId, 'ID is not valid')
                app.models.index.ListItem
                    .query(qb => qb.where('listId', '=', listId))
                    .fetchPage({ pageSize: 10, page })
                    .then(items => res.status(200).json(items))
                    .catch(err => res.status(500).send(err))
            } catch(msg) {
                return res.status(400).send(msg)
            }
        }

    
        return { save, remove, get, getById, getByListId}
}