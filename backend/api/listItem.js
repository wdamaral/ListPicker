module.exports = app => {
    const {
        notExistsOrError,
        existsOrError,
        equalsOrError,
        isValidID,
        isNumber
    } = app.api.validation
    const {
        ListItem,
        List
    } = app.models.index

    const save = async (req, res) => {
        const item = {
            ...req.body
        }

        if (req.params.id) item.listId = req.params.id
        try {
            existsOrError(item.item, 'Item name cannot be blank.')
            existsOrError(item.quantity, 'Quantity cannot be blank.')
            existsOrError(item.unit, 'Unit cannot be blank.')
            existsOrError(item.listId, 'List not found.')

            const list = await List.forge({
                id: item.listId,
                pickerId: null
            }).fetch()
            try {

                existsOrError(list, 'List already picked. You cannot edit it.')
            } catch (msg) {
                return res.status(403).send(msg)
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        app.db('listItems')
            .insert(item)
            .then(async _ => {
                let numberOfItems = await ListItem
                    .where({
                        listId: item.listId
                    })
                    .count('id')

                await List
                    .where({
                        id: item.listId
                    })
                    .save({
                        totalItems: numberOfItems
                    }, {
                        method: 'update',
                        patch: true
                    })
                return res.status(204).send()
            })
            .catch(err => {
                return res.status(500).send(err)
            })

    }
    const update = async (req, res) => {
        const listId = req.params.listId
        const itemId = req.params.itemId

        const updates = {
            ...req.body
        }
        try {
            const list = await List
                .where({
                    id: listId
                })
                .fetch()

            equalsOrError(list.get('pickerId'), req.user.id, 'You cannot edit this list.')
        } catch (msg) {
            return res.status(403).send(msg)
        }

        let item
        try {
            isNumber(updates.cost, 'Item cost is invalid.')
            isValidID(listId, "Item not found for this list.")
            isValidID(itemId, "Item not found for this list.")

            item = await ListItem
                .where({
                    listId: listId,
                    id: itemId
                }).fetch()
            existsOrError(item, 'Item not found for this list.')
        } catch (msg) {
            // console.log(msg)
            return res.status(400).send(msg)
        }

        return ListItem
            .where({
                id: item.id
            })
            .save(updates, {
                method: update,
                patch: true
            })
            .then(_ => res.status(200).send('Success! Item updated.'))
            .catch(err => {
                // console.log(err)
                res.status(500).send(err)
            })
    }

    const remove = async (req, res) => {
        const listId = req.params.listId
        const itemId = req.params.itemId
        try {
            isValidID(listId, "Item not found for this list.")
            isValidID(itemId, "Item not found for this list.")

            let item = await ListItem.where({
                listId,
                id: itemId
            }).fetch()
            existsOrError(item, 'Item not found for this list.')
            // console.log(item)


            try {
                const list = await List
                    .where({
                        id: listId
                    })
                    .fetch()

                notExistsOrError(list.get('pickerId'), 'You cannot edit this list. It is already picked.')
            } catch (msg) {
                return res.status(403).send(msg)
            }

            let rowsDeleted = await new ListItem(item).destroy()
            try {
                notExistsOrError(rowsDeleted.message, 'Item not found for this list.')
            } catch (msg) {
                return res.status(400).send(msg)
            }
            let numberOfItems = await ListItem
                .where({
                    listId
                })
                .count('id')

            await List
                .where({
                    id: listId
                })
                .save({
                    totalItems: numberOfItems
                }, {
                    method: 'update',
                    patch: true
                })
            return res.status(204).send('Item removed.')
        } catch (msg) {
            return res.status(500).send(msg)
        }
    }

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

    return {
        save,
        remove,
        update,
        getByListId
    }
}