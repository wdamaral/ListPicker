// Update with your config settings.
const db = {
  host: '127.0.0.1',
  port: 5432,
  database: 'listpicker',
  user: 'postgres',
  password: '123456'
}

module.exports = {

  client: 'postgresql',
  connection: process.env.DATABASE_URL || db,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  },
  sslmode: 'require'
};