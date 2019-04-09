exports.up = function (knex, Promise) {
    return knex.schema.createTable('listItems', table => {
        table.increments('id').primary()
        table.string('item').notNull()
        table.decimal('quantity', [13, 2]).notNull()
        table.string('unit', 3).notNull()
        table.string('brand')
        table.string('comments', 120)
        table.decimal('cost', [13, 2])
        table.integer('listId').notNull().references('id')
            .inTable('lists').onDelete('CASCADE')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('listItems')
};