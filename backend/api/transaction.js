module.exports = app => {

    const {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        isValidID,
        isNumber,
        isGreaterOrError
    } = app.api.validation
    const {
        User,
        Wallet,
        Transaction
    } = app.models.index

    const makePayment = async (toId, fromId, amount, t) => {
        const {
            putMoney,
            removeMoney
        } = app.api.wallet
        console.log(amount)
        try {
            isValidID(fromId, 'User ID is invalid.')
            isValidID(toId, 'User ID is invalid.')
            isNumber(amount, 'Amount is invalid.')

            const walletFrom = await Wallet
                .forge({
                    userId: fromId
                })
                .fetch()

            existsOrError(walletFrom, 'Wallet not found.')
            isGreaterOrError(walletFrom.get('balance'), amount, 'Balance is not enough to pay.')

            const walletTo = await Wallet
                .forge({
                    userId: toId
                })
                .fetch()

            existsOrError(walletTo, 'Wallet not found.')
            const transac = {
                fromId: walletFrom.get('id'),
                toId: walletTo.get('id'),
                amount,
                type: 'Payment'
            }
            return Transaction.forge(transac).save(null, {
                transacting: t
            })

        } catch (msg) {
            return Promise.reject(msg)
        }
    }

    const deposit = async (req, res) => {
        const transac = {
            ...req.body
        }

        const user = {
            ...req.user
        }

        const {
            putMoney
        } = app.api.wallet

        try {
            isValidID(req.params.id, 'User ID is invalid.')
            isNumber(transac.amount, 'Amount is invalid.')

            const wallet = await Wallet
                .forge({
                    userId: user.id
                })
                .fetch()
            transac.toId = wallet.id

            existsOrError(wallet, 'Wallet not found.')

            app.bookshelf.transaction(t => {
                    return Promise.all([
                        new Transaction(transac).save(null, {
                            transaction: t
                        }),
                        putMoney(transac.amount, user.id)
                    ])
                })
                .then(_ => res.status(200).send('Deposit made successfully.'))
                .catch(err => res.status(500).send(err))

        } catch (msg) {
            // console.log(msg)
            return res.status(400).send(msg)
        }
    }

    const withdraw = async (req, res) => {
        const {
            removeMoney
        } = app.api.wallet

        const transac = {
            ...req.body
        }
        const user = {
            ...req.user
        }

        try {
            isValidID(req.params.id, 'User ID is invalid.')
            isNumber(transac.amount, 'Amount is invalid.')


            const wallet = await Wallet
                .forge({
                    userId: user.id
                })
                .fetch()
            transac.fromId = wallet.id

            existsOrError(wallet, 'Wallet not found.')
            isGreaterOrError(wallet.get('balance'), transac.amount, 'Balance is not enough.')
            app.bookshelf.transaction(t => {
                    return Promise.all([
                        new Transaction(transac).save(null, {
                            transaction: t
                        }),
                        removeMoney(transac.amount, user.id)
                    ])
                })
                .then(_ => res.status(200).send('Withdraw made successfully.'))
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const getByUserId = async (req, res) => {
        const page = req.query.page || 1
        try {
            isValidID(req.params.id, 'ID not valid.')
            const wallet = await Wallet
                .forge({
                    userId: req.params.id
                })
                .fetch()

            existsOrError(wallet, 'Wallet not found.')

            Transaction
                .query(
                    qb => qb.where({
                        fromId: wallet.id
                    })
                    .orWhere({
                        toId: wallet.id
                    })
                )
                .orderBy('-date')
                .fetchPage({
                    withRelated: ['from.user', 'to.user'],
                    pageSize: 8,
                    page
                })
                .then(transactions => res.status(200).json({
                    transactions,
                    pagination: transactions.pagination
                }))
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    return {
        makePayment,
        deposit,
        withdraw,
        getByUserId
    }
}