const admin = require('./admin')
const listOwner = require('./listOwner')
const listPicker = require('./listPicker')

module.exports = app => {

    app.post('/users', app.api.user.insert)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)
    app.post('/forgot-password', app.api.auth.forgotPassword)
    app.post('/reset-password/:token', app.api.auth.resetPassword)
    app.get('/validate-list/:id', app.api.list.validateList)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.user.get))
    //.get(app.api.user.get)

    app.route('/users/address/:listId')
        .all(app.config.passport.authenticate())
        .get(app.api.user.getAddress)

    app.route('/users/:id/wallet/deposit')
        .all(app.config.passport.authenticate())
        .post(app.api.transaction.deposit)

    app.route('/users/:id/wallet/withdraw')
        .all(app.config.passport.authenticate())
        .post(app.api.transaction.withdraw)

    app.route('/users/:id/wallet/transactions')
        .all(app.config.passport.authenticate())
        .get(app.api.transaction.getByUserId)

    app.route('/users/:id/wallet')
        .all(app.config.passport.authenticate())
        .get(app.api.wallet.getByUserId)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.update)
        .get(app.api.user.getById)
        .delete(app.api.user.deleteUser)

    app.route('/stores')
        .all(app.config.passport.authenticate())
        .get(app.api.store.get)
        .post(admin(app.api.store.insert))

    app.route('/stores/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.store.getById)
        .put(admin(app.api.store.update))
        .delete(admin(app.api.store.remove))

    app.route('/lists')
        .all(app.config.passport.authenticate())
        .get(app.api.list.get)
        .post(app.api.list.save)

    app.route('/lists/mylists')
        .all(app.config.passport.authenticate())
        // .get(listOwner(app.api.list.getOwnedByUserId))
        .get(app.api.list.getOwnedByUserId)

    app.route('/lists/mypicks')
        .all(app.config.passport.authenticate())
        // .get(listPicker(app.api.list.getPickedByUserId))
        .get(app.api.list.getPickedByUserId)

    app.route('/lists/:id/items')
        .all(app.config.passport.authenticate())
        .post(listOwner(app.api.listItem.save))

    app.route('/lists/:id/confirmed')
        .all(app.config.passport.authenticate())
        .put(listOwner(app.api.list.confirmDelivery))

    app.route('/lists/:id/bought')
        .all(app.config.passport.authenticate())
        .put(listPicker(app.api.list.markBought))

    app.route('/lists/:id/delivered')
        .all(app.config.passport.authenticate())
        .put(listPicker(app.api.list.deliver))

    app.route('/lists/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.list.getById)
        .patch(app.api.list.edit)
        .delete(listOwner(app.api.list.remove))
        .put(listPicker(app.api.list.saveReceipt))

    app.route('/lists/history/closed')
        .all(app.config.passport.authenticate())
        .get(app.api.list.getHistoryByUserId)

    app.route('/lists/:listId/items/:itemId/delete')
        .all(app.config.passport.authenticate())
        .delete(app.api.listItem.remove)

    app.route('/lists/:listId/items/:itemId')
        .all(app.config.passport.authenticate())
        .put(app.api.listItem.update)

    app.route('/lists/:listId/pick')
        .all(app.config.passport.authenticate())
        .post(app.api.list.pickList)

    app.route('/upload')
        .all(app.config.passport.authenticate())
        .post(app.api.imageUpload.uploadPicture)
}