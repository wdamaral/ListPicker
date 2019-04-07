const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
var mg = require('nodemailer-mailgun-transport')


module.exports = app => {

    const {
        existsOrError,
        equalsOrError
    } = app.api.validation

    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Please, type user and password.')
        }

        const user = await app.db('users')
            .where({
                email: req.body.email
            })
            .first()
        if (!user) return res.status(400).send('User not found.')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(401).send('Invalid Email / Password.')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            admin: user.admin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            iat: now,
            exp: now + (60 * 60 * 24)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, process.env.AUTH_SECRET)
        })
    }
    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if (userData) {
                const token = jwt.decode(userData.token, process.env.AUTH_SECRET)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            //token problems
        }

        res.send(false)
    }

    const defaultEmailData = {
        from: 'do-not-reply@listpicker.ca'
    }
    const mgAuth = {
        auth: {
            api_key: process.env.MG_KEY,
            domain: process.env.MG_BASE
        }
    }

    const forgotPassword = async (req, res) => {
        const email = req.body.email

        const user = await app.db('users')
            .where({
                email
            })
            .first()
        if (!user) return res.status(400).send('User not found.')

        const token = crypto.randomBytes(20).toString('hex');

        const emailData = {
            to: user.email,
            subject: 'Grocery List Picker password reset',
            text: `Please, use the following link for instructions to reset your password: \n\n${process.env.APP_URL}reset-password/${token}`
        }
        const now = new Date(Date.now() + 1800).toISOString()

        app.db('users')
            .where({
                id: user.id
            })
            .update({
                resetPasswordToken: token,
                resetPasswordExpires: now
            })
            .then((id) => {
                const completeEmailData = Object.assign(defaultEmailData, emailData)
                const transporter = nodemailer.createTransport(mg(mgAuth))

                transporter
                    .sendMail(completeEmailData, (err, info) => {
                        if (err) {
                            return res.status(500).send(err)
                        }
                        return res.status(200).send('Email sent successfully.')
                    })
            })

    }

    const getUserByToken = (token) => {
        return app.db('users')
            .where('resetPasswordToken', token)
            .first()
            .then(user => user)
            .catch(err => err)
    }

    const resetPassword = async (req, res) => {
        const token = req.params.token

        try {
            existsOrError(token, 'Token is invalid.')
            existsOrError(req.body.password, 'Password cannot be blank')
            existsOrError(req.body.confirmPassword, 'Invalid password confirmation')
            equalsOrError(req.body.password, req.body.confirmPassword,
                'Passwords do not match')
        } catch (msg) {
            return res.status(400).send(msg)
        }
        const user = await getUserByToken(token)
        if (!user) return res.status(400).send('User not found')

        if (user.resetPasswordExpires > Date.now()) return res.status(403).send('Token expired.')

        const password = app.api.user.encryptPassword(req.body.password)

        app.db('users')
            .where({
                id: user.id,
                email: user.email,
                resetPasswordToken: token
            })
            .update({
                password: password,
                resetPasswordToken: null,
                resetPasswordExpires: null
            })
            .then(_ => res.status(200).send('Password updated.'))
            .catch(err => res.status(400).send('Fail to update password. Try again.'))
    }
    return {
        signin,
        validateToken,
        forgotPassword,
        resetPassword
    }
}