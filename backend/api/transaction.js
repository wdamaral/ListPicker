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

    const makePayment = async (req, res) => {
        const {
            putMoney,
            removeMoney
        } = app.api.wallet
        // const makePayment = async (from, to, amount) => {
        // const transac = {
        //     fromId: from,
        //     toId: to,
        //     amount,
        //     type: 'Payment'
        // }

        const transac = {
            ...req.body
        }

        try {
            isValidID(transac.fromId, 'User ID is invalid.')
            isValidID(transac.toId, 'User ID is invalid.')
            isNumber(transac.amount, 'Amount is invalid.')

            const walletFrom = await Wallet
                .forge({
                    userId: req.params.id
                })
                .fetch()

            existsOrError(walletFrom, 'Wallet not found.')
            isGreaterOrError(walletFrom.balance, transac.amount, 'Balance is not enough to pay.')

            const walletTo = await Wallet
                .forge({
                    id: transac.toId
                })
                .fetch()

            existsOrError(walletTo, 'Wallet not found.')

            return app.bookshelf.transaction(t => {
                    let pay = removeMoney(transac.amount, walletFrom.id)
                    let receive = putMoney(transac.amount, walletTo.id)
                    let transaction = Transaction.forge(transac).save(null, {
                        transaction: t
                    })
                    return Promise.all([pay, receive, transaction])
                })
                .then(_ => res.status(204).send())
                .catch(err => {
                    // console.log(err)
                    return res.status(500).send(err)
                })
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const deposit = async (req, res) => {
        let transac = {
            ...req.body
        }

        const {
            putMoney
        } = app.api.wallet

        try {
            isValidID(req.params.id, 'User ID is invalid.')
            isNumber(transac.amount, 'Amount is invalid.')

            const wallet = await Wallet
                .forge({
                    userId: req.params.id
                })
                .fetch()
            transac.toId = wallet.id

            existsOrError(wallet, 'Wallet not found.')

            app.bookshelf.transaction(t => {
                    return Promise.all([
                        new Transaction(transac).save(null, {
                            transaction: t
                        }),
                        putMoney(transac.amount, wallet.id)
                    ])
                })
                .then(_ => res.status(200).send('Deposit made successfully.'))
                .catch(err => res.status(500).send(err))

        } catch (msg) {
            console.log(msg)
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

        try {
            isValidID(req.params.id, 'User ID is invalid.')
            isNumber(transac.amount, 'Amount is invalid.')

            const wallet = await Wallet
                .forge({
                    userId: req.params.id
                })
                .fetch()
            transac.fromId = wallet.id

            existsOrError(wallet, 'Wallet not found.')

            app.bookshelf.transaction(t => {
                    return Promise.all([
                        new Transaction(transac).save(null, {
                            transaction: t
                        }),
                        removeMoney(transac.amount, wallet.id)
                    ])
                })
                .then(_ => res.status(200).send('Withdraw made successfully.'))
                .catch(err => res.status(500).send(err))
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const getByUserId = async (req, res) => {
        try {
            isValidID(req.params.id, 'ID not valid.')
            const wallet = await Wallet
                .forge({
                    userId: req.params.id
                })
                .fetch()

            existsOrError(wallet, 'Wallet not found.')

            return res.status(200).send(wallet)
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