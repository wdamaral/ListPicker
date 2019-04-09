require('./config/config')
const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const port = process.env.PORT || 3000

app.db = db

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./bookshelf.js')
    .then('./models')
    .then('./api')
    .then('./api/wallet.js')
    .then('./config/routes.js')
    .into(app)
app.listen(port, () => {
    // console.log(app.api)
    console.log('Backend running...')
})