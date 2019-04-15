const knex = require('knex')
const db = require('./db')


module.exports = middleware => {
    // console.log(middleware)
    return async (req, res, next) => {

        try {
            const list = await db('lists').where({
                id: req.params.id,
                ownerId: req.user.id
            }).first()
            // console.log(list)
            if (!list) {
                return res.status(401).send('You are not the owner of this list.')
            }
            middleware(req, res, next)
        } catch (msg) {
            return res.status(500).send(msg)
        }
    }
}