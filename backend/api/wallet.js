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

    const putMoney = async (amount, id, t) => {
        const wallet = await Wallet
            .forge({
                userId: id
            })
            .fetch()
        amount += wallet.get('balance') * 1
        return Wallet
            .forge({
                id: wallet.get('id')
            })
            .save({
                balance: amount
            }, {
                method: 'update',
                transacting: t
            })
    }

    const removeMoney = async (amount, id, t) => {
        const wallet = await Wallet
            .forge({
                userId: id
            })
            .fetch()

        const newBalance = wallet.get('balance') - amount

        if (newBalance < 0) {
            return Promise.reject('Balance is not enough to pay.')
        }
        return Wallet
            .forge({
                id: wallet.get('id')
            })
            .save({
                balance: amount
            }, {
                method: 'update',
                transacting: t
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