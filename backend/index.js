require('./config/config')
const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const port = process.env.PORT || 3000
const cors = require('cors')

app.db = db
app.use(cors())

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./bookshelf.js')
    .then('./models')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.listen(port, () => {
    // console.log(app.models)
    console.log('Backend running...')
})