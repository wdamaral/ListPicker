
exports.up = function(knex, Promise) {
    return knex.schema.createTable('stores', table => {
        table.increments('id').primary()
        table.string('name').notNull().unique()
        table.string('description', 144)
        table.string('imageUrl').defaultTo('noimage.png')
    })
};

exports.down = function(knex, Promise) {
    return knex.schemas.dropTable('stores')
};
