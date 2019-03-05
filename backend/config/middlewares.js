const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const path = require('path')


module.exports = app => {
    app.use(bodyParser.json())
    // app.use(bodyParser.urlencoded({extended: false}))
    app.use('/uploads', express.static('uploads'))
    app.use(cors())
}