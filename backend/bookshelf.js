const db = require('./knexfile.js')

const knex = require('knex')(db)
const bookshelf = require('bookshelf')(knex)
bookshelf.plugin('pagination')
module.exports = bookshelf
