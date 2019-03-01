module.exports = app => {
    const { existsOrError, isValidID } = app.api.validation
    const { ListItem } = app.models.index

    const save = (req, res) => {
        const listItems = { ...req.body }
        if(req.params.id) listItem.id = req.params.id

        try {
            for(let item of listItems) {
                existsOrError(item.item, 'Item cannot be blank.')
                existsOrError(item.quantity, 'Quantity cannot be blank.')
                existsOrError(item.unit, 'Unit cannot be blank.')
                existsOrError(item.listId, 'List ID not valid')
            }
            
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
            isValidID(req.params.itemId, "ID not valid.")
            
            let listId = req.params.id
            let itemId = req.params.itemId
            const ListItem = app.models.index.ListItem
            let rowsDeleted = new ListItem({id: itemId, listId}).destroy()
                try {
                    notExistsOrError(rowsDeleted.message, 'List not found.')
                } catch(msg) {
                    return res.status(400).send(msg)
                }
                return res.status(204).send()
            } catch(msg) {
                return res.status(500).send(msg)
            }
    }

    // const getByListId = (req, res) => {
    //     const listId = req.params.id
    //     const page = req.query.page || 1

    //     try {
    //         isValidID(listId, 'ID is not valid')
    //         ListItem
    //             .query(qb => qb.where('listId', '=', listId))
    //             .fetchPage({ pageSize: 10, page })
    //             .then(items => res.status(200).json({items: items, pagination: items.pagination}))
    //             .catch(err => res.status(500).send(err))
    //     } catch(msg) {
    //         return res.status(400).send(msg)
    //     }
    // }

    const getByListId = (listId) => {
        //const listId = req.params.id
            return new Promise((resolve, reject) => {
                return ListItem
                    .query(qb => qb.where('listId', '=', listId))
                    .fetchAll()
                    .then(items => resolve(items))
                    .catch(err => reject(err))
        })
    }

    return { save, remove, getByListId }
}