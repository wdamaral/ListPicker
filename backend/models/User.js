
module.exports = app => {

    return app.bookshelf.Model.extend(
        {
            tableName: 'users',
            lists: function() {
                return this.hasMany(List, 'ownerId');
            },
            listsPick: function() {
                return this.hasMany(List, 'pickerId');
            }
        }
    );
}