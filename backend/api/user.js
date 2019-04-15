const bcrypt = require('bcrypt-nodejs')

const {
    geocodeAddress
} = require('./geocode/geocode')
module.exports = app => {
    const {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        isValidID,
        isValidPassword,
        lengthOrError
    } = app.api.validation
    const {
        User,
        List,
        Wallet
    } = app.models.index
    const {
        moveFile
    } = app.api.imageUpload

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const update = async (req, res) => {
        const user = {
            ...req.body
        }

        if (req.params.id) user.id = req.params.id

        let userFromDB
        if (!req.originalUrl.startsWith('/users')) user.admin = false
        if (!req.user || !req.user.admin) user.admin = false

        if (!user.profilePicture) delete user.profilePicture

        try {
            existsOrError(user.firstName, 'First name cannot be blank')
            existsOrError(user.lastName, 'Last name cannot be blank')
            existsOrError(user.email, 'Email cannot be blank')
            existsOrError(user.phoneNumber, 'Phone number cannot be blank')
            existsOrError(user.street, 'Address cannot be blank')
            existsOrError(user.city, 'City cannot be blank')
            existsOrError(user.province, 'Province cannot be blank')
            existsOrError(user.postalCode, 'Postal code cannot be blank')
            lengthOrError(user.unit, 10, 'Unit is invalid.')
            if (user.password) {
                existsOrError(user.password, 'Password cannot be blank')
                existsOrError(user.confirmPassword, 'Invalid password confirmation')
                isValidPassword(user.password, 'Password must contain 8 characters, at least 1 letter, 1 number and 1 special character')
                equalsOrError(user.password, user.confirmPassword,
                    'Passwords do not match')
            }

            userFromDB = await User
                .where({
                    id: user.id
                })
                .fetch()

            if (userFromDB.get('email') !== user.email) {
                const newUserEmail = await User
                    .where({
                        email: user.email
                    })
                    .fetch()
                notExistsOrError(newUserEmail, 'User already exists')
            }


        } catch (msg) {
            return res.status(400).send(msg)
        }


        try {
            let coordinates = await geocodeAddress(`${user.street}, ${user.city}, ${user.province}`)
            if (coordinates.latitude) {
                user.latitude = coordinates.latitude
                user.longitude = coordinates.longitude
            } else {
                return res.status(400).send('Address is not valid.')
            }
        } catch (err) {
            return res.status(500).send('Fail to connect to Google API.')
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.profilePicture) {
            app.bookshelf.transaction(t => {
                    let pic = user.profilePicture
                    let saveUser = new User(user).save(null, {
                        transacting: t
                    })
                    let movePic = moveFile(pic, 'users')
                    return Promise.all([saveUser, movePic])
                })
                .then(_ => res.status(204).send())
                .catch(err => {
                    // console.log(err)
                    res.status(500).send(err)
                })
        } else {


            User
                .forge({
                    id: user.id
                })
                .save(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const insert = async (req, res) => {
        const user = {
            ...req.body
        }
        if (req.params.id) user.id = req.params.id

        if (!req.originalUrl.startsWith('/users')) user.admin = false
        if (!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.firstName, 'First name cannot be blank')
            existsOrError(user.lastName, 'Last name cannot be blank')
            existsOrError(user.email, 'Email cannot be blank')
            existsOrError(user.phoneNumber, 'Phone number cannot be blank')
            existsOrError(user.street, 'Address cannot be blank')
            existsOrError(user.city, 'City cannot be blank')
            existsOrError(user.province, 'Province cannot be blank')
            existsOrError(user.postalCode, 'Postal code cannot be blank')
            lengthOrError(user.unit, 10, 'Unit is invalid.')
            existsOrError(user.password, 'Password cannot be blank.')
            existsOrError(user.confirmPassword, 'Invalid password confirmation')
            isValidPassword(user.password, 'Password must contain 8 characters, at least 1 letter, 1 number and 1 special character')
            equalsOrError(user.password, user.confirmPassword,
                'Passwords do not match')

            const userFromDB = await User
                .where({
                    email: user.email
                })
                .fetch()
            if (!user.id) {
                notExistsOrError(userFromDB, 'User already exists')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        try {
            const coordinates = await geocodeAddress(`${user.street}, ${user.city}, ${user.province}`)
            // console.log(coordinates)

            if (coordinates) {
                user.latitude = coordinates.latitude
                user.longitude = coordinates.longitude
            } else {
                return res.status(400).send('Address is not valid.')
            }
        } catch (err) {
            return res.status(500).send('Fail to connect to Google API.')
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.profilePicture) {
            app.bookshelf.transaction(t => {
                    let pic = user.profilePicture
                    let saveUser = new User(user).save(null, {
                            transacting: t
                        })
                        .tap(user => {
                            return new Wallet({
                                    userId: user.id
                                })
                                .save(null, {
                                    transacting: t
                                })
                        })
                    let movePic = moveFile(pic, 'users')
                    return Promise.all([saveUser, movePic])

                })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {

            app.bookshelf.transaction(t => {
                    return new User(user)
                        .save(null, {
                            transacting: t
                        })
                        .tap(user => {
                            return new Wallet({
                                    userId: user.id
                                })
                                .save(null, {
                                    transacting: t
                                })
                        })

                })
                .then(_ => res.status(204).send())
                .catch(err => {
                    // console.log(err)
                    return res.status(500).send(err)
                })
        }
    }


    const get = (req, res) => {
        const page = req.query.page || 1
        User
            .query(qb => qb)
            .orderBy('firstName')
            .fetchPage({
                columns: ['id', 'email', 'firstName', 'createdAt'],
                pageSize: 10,
                page
            })
            .then(users => res.status(200).json({
                users: users,
                pagination: users.pagination
            }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {

        try {
            isValidID(req.params.id, 'ID not valid.')

            if (req.user.id == req.params.id || req.user.admin) {
                User
                    .where('id', req.params.id)
                    .fetch({
                        withRelated: ['lists', 'listsPick'],
                        columns: ['id', 'firstName', 'lastName', 'email', 'street',
                            'city', 'province', 'admin', 'phoneNumber', 'unit', 'postalCode',
                            'createdAt', 'updatedAt', 'deletedAt', 'profilePicture', 'latitude',
                            'longitude'
                        ]
                    })
                    .then(user => res.status(200).json(user))
                    .catch(err => res.status(500).send(err))
            } else {
                User
                    .where('id', req.params.id)
                    .fetch({
                        withRelated: ['lists', 'listsPick'],
                        columns: ['id', 'firstName', 'city', 'province', 'admin',
                            'createdAt', 'latitude', 'longitude', 'profilePicture'
                        ]
                    })
                    .then(user => res.status(200).json(user))
                    .catch(err => res.status(500).send(err))
            }

        } catch (msg) {
            // console.log(msg)
            return res.status(400).send(msg)
        }
    }

    const getAddress = async (req, res) => {
        const listId = req.params.listId
        // console.log(listId)

        try {
            isValidID(listId, 'Invalid list ID')

            const list = await List
                .query(qb => qb.where({
                        id: listId,
                        pickerId: req.user.id
                    })
                    .orWhere({
                        id: listId,
                        ownerId: req.user.id
                    }))
                .fetch({
                    withRelated: [{
                        'owner': qb => qb.select(['street', 'unit', 'city', 'province', 'postalCode', 'phoneNumber', 'email', 'id'])
                    }]
                })

            existsOrError(list, 'List not found.')
            return res.status(200).send(list.related('owner'))
        } catch (err) {
            // console.log(err)
            return res.status(400).send(err)
        }
    }

    const deleteUser = async (req, res) => {
        const id = req.params.id || null

        try {
            isValidID(id, 'ID is invalid.')

            const user = await User
                .forge({
                    id
                })
                .fetch()

            existsOrError(user, 'User not found.')

            return User
                .forge({
                    id: user.id
                })
                .save({
                    deletedAt: new Date(Date.now())
                }, {
                    method: 'update',
                    patch: true
                })
                .then(_ => res.status(200).send('User deactivated.'))
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }


    return {
        insert,
        update,
        get,
        getAddress,
        getById,
        encryptPassword,
        deleteUser
    }
}