module.exports = app => {
    const {
        Wallet,
    } = app.models.index

    const putMoney = async (amount, id, t) => {
        const wallet = await Wallet
            .forge({
                userId: id
            })
            .fetch()
        const newBalance = (wallet.get('balance') * 1) + amount * 1

        if (t) {
            return Wallet
                .forge({
                    id: wallet.get('id')
                })
                .save({
                    balance: newBalance
                }, {
                    method: 'update',
                    transacting: t
                })
        }
        return Wallet
            .forge({
                id: wallet.get('id')
            })
            .save({
                balance: newBalance
            }, {
                method: 'update'
            })
    }

    const removeMoney = async (amount, id, t) => {
        const wallet = await Wallet
            .forge({
                userId: id
            })
            .fetch()

        const newBalance = (wallet.get('balance') * 1) - amount

        if (newBalance < 0) {
            return Promise.reject('Balance is not enough to pay.')
        }
        if (t) {

            return Wallet
                .forge({
                    id: wallet.get('id')
                })
                .save({
                    balance: newBalance
                }, {
                    method: 'update',
                    transacting: t
                })
        }

        return Wallet
            .forge({
                id: wallet.get('id')
            })
            .save({
                balance: newBalance
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
            .then(wallet => res.status(200).send(wallet))
            .catch(err => res.status(500).send(err))
    }

    return {
        putMoney,
        removeMoney,
        getByUserId
    }
}