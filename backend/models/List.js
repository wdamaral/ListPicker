
module.exports = app => {

    return app.bookshelf.Model.extend(
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
        }
    );
}