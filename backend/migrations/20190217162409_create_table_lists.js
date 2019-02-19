
exports.up = function(knex, Promise) {
  return knex.schema.createTable('lists', table => {
      table.increments('id').primary()
      table.decimal('totalCost', [13, 2])
      table.integer('totalItems')
      table.string('receiptNumber')
      table.timestamp('createdAt').notNull().defaultTo(knex.fn.now())
      table.timestamp('updatedAt')
      table.integer('storeId').references('id')
            .inTable('stores')
      table.integer('userId').references('id')
            .inTable('users')
      table.integer('pickerId').references('id')
            .inTable('users')
  })
    
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('lists')
  
};
