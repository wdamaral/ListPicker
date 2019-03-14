module.exports = app => {
    const Store = app.bookshelf.Model.extend(
        {
            tableName: 'stores',
            lists: function() {
                return this.hasMany(List, 'storeId')
            }
        })

    const User = app.bookshelf.Model.extend(
        {
            tableName: 'users',
            lists: function() {
                return this.hasMany(List, 'ownerId');
            },
            listsPick: function() {
                return this.hasMany(List, 'pickerId');
            }
        })

    const List = app.bookshelf.Model.extend(
        {
            tableName: 'lists',
            owner: function() {
                return this.belongsTo(User)
            },
            listItems: function() {
                return this.hasMany(ListItem, 'listId')
            },
            store: function() {
                return this.belongsTo(Store)
            },
            picker: function() {
                return this.belongsTo(User)
            }
        })
    
    const ListItems = app.bookshelf.Model.extend(
        {
            tableName: 'listItems',
            list: function() {
                return this.belongsTo(List)
            }
        })

        return { User, Store, List, ListItems }
}