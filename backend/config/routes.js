const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        //.all(app.config.passport.authenticate())
        .post(app.api.user.save)
        // .get(admin(app.api.user.get))
        .get(app.api.user.get)
    app.route('/users/:id')
        //.all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/stores')
        //.all(app.config.passport.authenticate())
        .get(app.api.store.get)
        // .post(admin(app.api.store.save))
        .post(app.api.store.save)

    app.route('/stores/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.store.getById)
        .put(app.api.store.save)
        .delete(app.api.store.remove)

        app.route('/lists')
        //.all(app.config.passport.authenticate())
        .get(app.api.list.get)
        .post(app.api.list.save)

    app.route('/lists/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.list.getById)
        .put(app.api.list.save)
        .delete(app.api.list.remove)

    app.route('/lists/:id/items')
        //.all(app.config.passport.authenticate())
        .get(app.api.listItem.getByListId)
}