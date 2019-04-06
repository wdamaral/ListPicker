const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')


module.exports = app => {
    app.use(bodyParser.json())
    // app.use(bodyParser.urlencoded({extended: false}))
    app.use('/temp', express.static('temp'))
    app.use('/uploads', express.static('uploads'))
    app.use(cors())
}