module.exports = app => {
    const Store = app.bookshelf.Model.extend({
        tableName: 'stores',
        lists: function () {
            return this.hasMany(List, 'storeId')
        }
    })

    const User = app.bookshelf.Model.extend({
        tableName: 'users',
        lists: function () {
            return this.hasMany(List, 'ownerId');
        },
        listsPick: function () {
            return this.hasMany(List, 'pickerId');
        },
        wallet: function () {
            return this.belongsTo(Wallet, 'userId');
        },
    })

    const List = app.bookshelf.Model.extend({
        tableName: 'lists',
        owner: function () {
            return this.belongsTo(User, 'ownerId')
        },
        listItems: function () {
            return this.hasMany(ListItem, 'listId')
        },
        store: function () {
            return this.belongsTo(Store, 'storeId')
        },
        picker: function () {
            return this.belongsTo(User, 'pickerId')
        }
    })

    const ListItem = app.bookshelf.Model.extend({
        tableName: 'listItems',
        list: function () {
            return this.belongsTo(List)
        }
    })

    const Wallet = app.bookshelf.Model.extend({
        tableName: 'wallets',
        user: function () {
            return this.belongsTo(User, 'userId')
        },
        transac_from: function () {
            return this.belongsToMany(Transaction, 'fromId')
        },
        transac_to: function () {
            return this.belongsToMany(Transaction, 'toId')
        }
    })

    const Transaction = app.bookshelf.Model.extend({
        tableName: 'transactions',
        from: function () {
            return this.belongsTo(Wallet, 'fromId')
        },
        to: function () {
            return this.belongsTo(Wallet, 'toId')
        }
    })

    return {
        User,
        Store,
        List,
        ListItem,
        Wallet,
        Transaction
    }
}