
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('lists', table => {
      table.timestamp('deliveredAt')
      table.timestamp('pickedAt')
      table.timestamp('confirmedAt')
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('lists', table => {
        table.dropColumn('confirmedAt')
        table.dropColumn('pickedAt')
        table.dropColumn('deliveredAt')
    })
};