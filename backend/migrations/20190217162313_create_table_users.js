exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('email').notNull().unique()
    table.string('password').notNull()
    table.string('firstName').notNull()
    table.string('lastName').notNull()
    table.double('latitude').notNull()
    table.double('longitude').notNull()
    table.string('phoneNumber', 10).notNull()
    table.string('profilePicture')
    table.string('street').notNull()
    table.string('unit', 10)
    table.string('city').notNull()
    table.string('province', 2).notNull()
    table.string('postalCode', 7).notNull()
    table.boolean('admin').notNull().defaultTo(false)
    table.timestamp('createdAt').notNull().defaultTo(knex.fn.now())
    table.timestamp('updatedAt')
    table.timestamp('deletedAt')
    table.string('resetPasswordToken')
    table.string('resetPasswordToken')
    table.timestamp('resetPasswordExpires')
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users')
};