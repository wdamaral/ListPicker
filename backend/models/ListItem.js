
module.exports = app => {

    return app.bookshelf.Model.extend(
        {
            tableName: 'listItems',
            list: function() {
                return this.belongsTo(List)
            }
        }
    );
}