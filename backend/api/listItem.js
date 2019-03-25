module.exports = app => {
    const { notExistsOrError, existsOrError, isValidID } = app.api.validation
    const { ListItem } = app.models.index

    const save = (req, res) => {
        const item = { ...req.body }
        if(req.params.itemId) listItem.id = req.params.itemId
        try {
                existsOrError(item.item, 'Item name cannot be blank.')
                existsOrError(item.quantity, 'Quantity cannot be blank.')
                existsOrError(item.unit, 'Unit cannot be blank.')
                existsOrError(item.listId, 'List not found.')
            
        } catch(msg) {
            res.status(400).send(msg)
        }
        
        app.db('listItems')
            .insert(item)
            .then(_ => res.status(204).send())
            .catch(err => {
                console.log(err)
                return res.status(500).send(err)})
        
    }
    const remove = async (req, res) => {
        const listId = req.params.listId
        const itemId = req.params.itemId
        try {
            isValidID(listId, "Item not found for this list.")
            isValidID(itemId, "Item not found for this list.")
            
            let item = await ListItem.where({ listId, id: itemId }).fetch()
                existsOrError(item, 'Item not found for this list.')

            let rowsDeleted = await new ListItem(item).destroy()
                try {
                    notExistsOrError(rowsDeleted.message, 'Item not found for this list.')
                } catch(msg) {
                    console.log(msg)
                    return res.status(400).send(msg)
                }
                return res.status(204).send('Item removed.')
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