module.exports = app => {
    const {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        isValidID,
        isValidPassword
    } = app.api.validation

    const {
        User,
        Wallet,
        Transaction
    } = app.models.index

    const putMoney = async (amount, id) => {
        const wallet = await Wallet
            .forge({
                id: id
            })
            .fetch()
        amount += wallet.get('balance') * 1
        return Wallet
            .forge({
                id
            })
            .save({
                balance: amount
            }, {
                method: 'update'
            })
    }

    const removeMoney = async (amount, id) => {
        const wallet = await Wallet
            .forge({
                id: id
            })
            .fetch()
        if (wallet.get('balance') < amount) return Promise.reject('Not enough funds.')
        amount = wallet.get('balance') - amount
        return Wallet
            .forge({
                id
            })
            .save({
                balance: amount
            }, {
                method: 'update'
            })
    }

    const getByUserId = (req, res) => {
        const user = {
            ...req.user
        }
        Wallet
            .forge({
                userId: user.id
            })
            .fetch()
            .then(_ => res.status(200).send())
            .catch(err => res.status(500).send(err))
    }

    return {
        putMoney,
        removeMoney
    }
}