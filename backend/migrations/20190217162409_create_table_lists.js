exports.up = function (knex, Promise) {
      return knex.schema.createTable('lists', table => {
            table.increments('id').primary()
            table.decimal('totalCost', [13, 2])
            table.integer('totalItems')
            table.string('receiptNumber')
            table.timestamp('createdAt').notNull().defaultTo(knex.fn.now())
            table.timestamp('updatedAt')
            table.timestamp('pickedAt')
            table.timestamp('deliveredAt')
            table.timestamp('confirmedAt')
            table.timestamp('boughtAt')
            table.boolean('isBought').defaultTo(false)
            table.boolean('isDelivered').defaultTo(false)
            table.boolean('isConfirmed').defaultTo(false)
            table.integer('storeId').references('id')
                  .inTable('stores')
            table.integer('ownerId').references('id')
                  .inTable('users')
            table.integer('pickerId').references('id')
                  .inTable('users')

      })

};

exports.down = function (knex, Promise) {
      return knex.schema.dropTable('lists')

};