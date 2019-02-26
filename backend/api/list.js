const Promise = require('bluebird')

module.exports = app => {
    const { existsOrError, notExistsOrError, isValidID, isNumber } = app.api.validation
    //const { getByList } = app.api.listItems
    
    const save = (req, res) => {
        const list = { ...req.body }
        if(req.params.id) list.id = req.params.id
        try {
            existsOrError(list.storeId, 'Store not selected.')
            existsOrError(list.ownerId, 'User ID is not valid.')
            isValidID(list.ownerId, 'Owner ID is not valid.')
            existsOrError(list.listItems, 'List must have items.')
            for(let item of list.listItems) {
                existsOrError(item.item, 'Invalid product name.')
                existsOrError(item.quantity, `${item.item}: Quantity is invalid`)
                isNumber(item.quantity, `${item.item}: Quantity is invalid.`)
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
        
        let List = app.models.index.List
        let ListItem = app.models.index.ListItem
        let listItems = list.listItems
        delete list.listItems
        if(list.id) {
            app.bookshelf.transaction(t => {
                return List(list)
                .save(null, {method: 'update', transacting: t})
                .tap(list => {
                    return Promise.map(listItems, (item) => 
                            new ListItem(item)
                            .save({'listId': list.id}, 
                            {transacting: t})
                    )
                  })
              })
              .then(_ => res.status(204).send())
              .catch(err =>  {
                  console.log(err)
                    res.status(500).send(err)
              })
            
        } else {

            app.bookshelf.transaction(t => {
                return new List(list)
                  .save(null, {transacting: t})
                  .tap(list => {
                    return Promise.map(listItems, (item) => 
                            new ListItem(item)
                            .save({'listId': list.id}, 
                            {transacting: t})
                    )
                  })
              })
              .then(_ => res.status(204).send())
              .catch(err =>  res.status(500).send(err))
        }
    }
        const remove = async (req, res) => {
            try {
                isValidID(req.params.id, "ID not valid.")
    
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
                isValidID(req.params.id, 'ID not valid.')
                app.db('listItems')
                    .where({ id: req.params.id })
                    .then(listItems => listItems)
                    .catch(err => res.status(500).send(err))
            } catch(msg) {
                return res.status(400).send(msg)
            }

            try {
                isValidID(req.params.id, 'ID not valid.')
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