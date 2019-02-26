
module.exports = app => {

    const User = app.bookshelf.Model.extend(
        {
            tableName: 'users',
            lists() {
                return this.hasMany(List, 'ownerId');
            },
            listsPick() {
                return this.hasMany(List, 'pickerId');
            }
        }
    );
    
    const List = app.bookshelf.Model.extend(
        {
            tableName: 'lists',
            user() {
                return this.belongsTo(User);
            },
            picker() {
                return this.belongsTo(User)
            },
            listItems() {
                return this.hasMany(ListItem, 'listId');
            },
            store() {
                return this.belongsTo(Store)
            }
        }
    );

    const ListItem = app.bookshelf.Model.extend(
        {
            tableName: 'listItems',
            list() {
                return this.belongsTo(List)
            }
        }
    );

    const Store = app.bookshelf.Model.extend(
        {
            tableName: 'stores',
            lists() {
                return this.hasMany(List, 'storeId')
            }
        }
    );
    
    
    return {User, List, ListItem, Store}
}