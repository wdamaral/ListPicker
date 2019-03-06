
module.exports = app => {

    return  app.bookshelf.Model.extend(
        {
            tableName: 'stores',
            lists: function() {
                return this.hasMany(List, 'storeId')
            }
        }
    );
}