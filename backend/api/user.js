const bcrypt = require('bcrypt-nodejs')

const { geocodeAddress }  = require('./geocode/geocode')
module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError, isValidID } = app.api.validation
    const { User }  = app.models
    
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    
    const save = async (req, res) => {
        const user = { ...req.body }
        // console.log(user)
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

            const userFromDB = await User
                                .where({ email: user.email })
                                .fetch()
            if(!user.id) {
                notExistsOrError(userFromDB, 'User already exists')
            }
            
        } catch(msg) {
            return res.status(400).send(msg)
        }

        try {
            let coordinates = await geocodeAddress(`${user.street}, ${user.city}, ${user.province}`)
            if(coordinates.latitude) {
                user.latitude = coordinates.latitude
                user.longitude = coordinates.longitude
            }
        } catch(err) {
            return res.status(500).send('Fail to connect to Google API.')
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id) {

            User
                .forge(user)
                .where({ id: user.id })
                .save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            User
                .forge(user)
                .save()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
            const page = req.query.page || 1
            User
                .query(qb => qb)
                .orderBy('firstName')
                .fetchPage({columns: ['id', 'email', 'firstName', 'lastName'], pageSize: 10, page })
                .then(users => res.status(200).json({users: users, pagination: users.pagination}))
                .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        try {
            isValidID(req.params.id, 'ID not valid.')
            User
                .where('id', req.params.id)
                .fetch({columns: ['id', 'firstName', 'lastName', 'phoneNumber', 'street', 
                'unit', 'city', 'province', 'postalCode', 'email', 'admin', 'createdAt', 'updatedAt']})
                .then(user => res.status(200).json(user))
                .catch(err => res.status(500).send(err))

        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    return { save, get, getById }
}