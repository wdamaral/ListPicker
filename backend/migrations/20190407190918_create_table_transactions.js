exports.up = function (knex, Promise) {
    return knex.schema.createTable('transactions', table => {
        table.increments('id').primary()
        table.string('type').notNull()
        table.integer('fromId').references('id')
            .inTable('wallets')
        table.integer('toId').references('id')
            .inTable('wallets')
        table.decimal('amount', [13, 2]).notNull()
        table.datetime('date').notNull().defaultTo(knex.fn.now())
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('transactions')

};