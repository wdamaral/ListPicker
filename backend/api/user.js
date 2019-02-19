const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError, numberOrError } = app.api.validation
    
    
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    
    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.firstName, 'First name cannot be blank')
            existsOrError(user.lastName, 'Last name cannot be blank')
            existsOrError(user.email, 'Email cannot be blank')
            existsOrError(user.phoneNumber, 'Phone number cannot be blank')
            existsOrError(user.street, 'Address cannot be blank')
            existsOrError(user.city, 'City cannot be blank')
            existsOrError(user.province, 'Province cannot be blank')
            existsOrError(user.postalCode, 'Postal code cannot be blank')
            existsOrError(user.password, 'Password cannot be blank')
            existsOrError(user.confirmPassword, 'Invalid password confirmation')
            equalsOrError(user.password, user.confirmPassword,
                'Passwords do not match')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'User already exists')
            }
            
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'firstName', 'lastName', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        try {
            numberOrError(req.params.id, 'ID not valid.')
            app.db('users')
                .select('id', 'firstName', 'lastName', 'phoneNumber', 'street', 
                        'unit', 'city', 'province', 'postalCode', 'email', 'admin', 'createdAt', 'updatedAt')
                .where({ id: req.params.id }).first()
                .then(user => res.json(user))
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    return { save, get, getById }
}