exports.up = function (knex, Promise) {
    return knex.schema.createTable('wallets', table => {
        table.increments('id').primary()
        table.integer('userId').notNull().unique().references('id')
            .inTable('users')
        table.decimal('balance', [13, 2])
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('wallets')

};