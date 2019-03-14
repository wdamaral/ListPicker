const admin = require('./admin')
const listOwner = require('./listOwner')
const listPicker = require('./listPicker')

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
        .all(app.config.passport.authenticate())
        .get(admin(app.api.store.get))
        .post(admin(app.api.store.save))

    app.route('/stores/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.store.getById)
        .put(admin(app.api.store.save))
        .delete(admin(app.api.store.remove))

        app.route('/lists')
        .all(app.config.passport.authenticate())
        .get(app.api.list.get)
        .post(app.api.list.save)

    app.route('/lists/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.list.getById)
        .patch(app.api.list.edit)
        .delete(app.api.list.remove)

    app.route('/lists/:id/items')
        //.all(app.config.passport.authenticate())
        .get(app.api.listItem.getByListId)

    app.route('/lists/:id/confirm-delivery')
        //.all(app.config.passport.authenticate())
        .post(listOwner(app.api.list.confirmDelivery))
        
    app.route('/lists/:id/deliver')
        .all(app.config.passport.authenticate())
        .post(listPicker(app.api.list.deliver))

    app.route('/lists/history/closed')
        .all(app.config.passport.authenticate())
        .post(listPicker(app.api.list.getOldByUserId))

    app.route('/lists/history/own')
        .all(app.config.passport.authenticate())
        .post(listPicker(app.api.list.getOwnedByUserId))

    app.route('/lists/history/pick')
        .all(app.config.passport.authenticate())
        .post(listPicker(app.api.list.getOwnedByUserId))

    app.route('/lists/:id/items/:itemId')
        .all(app.config.passport.authenticate())
        .post(app.api.listItem.remove)

    app.route('/upload')
        .post(app.api.imageUpload.uploadPicture)
}