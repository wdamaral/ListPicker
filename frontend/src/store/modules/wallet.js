import axios from 'axios'

import {
    baseApiUrl,
    userKey
} from '@/global'
export default {
    namespaced: true,
    state: {
        data: {},
        transactions: []
    },
    mutations: {
        SET_TRANSACTIONS(state, payload) {
            state.transactions = payload.data
        },
        SET_WALLET(state, payload) {
            state.data = payload.data
        }
    },
    actions: {
        NEW_TRANSACTION({
            commit,
            dispatch
        }, payload) {
            const {
                amount,
                route,
                transacType
            } = payload
            const id = route.params.id;
            const url = `${baseApiUrl}/users/${id}/wallet/${transacType}`;

            axios
                .post(url, {
                    amount,
                    type: transacType
                })
                .then(message => {
                    commit('activeSnackbar', message.data, {
                        root: true
                    })

                    dispatch('GET_WALLET', route)
                    dispatch('GET_TRANSACTIONS', {
                        route,
                        page: 1
                    })
                })
                .catch(err => {
                    let error
                    if (err.response) {
                        if (err.response.data) {
                            error = err.response.data
                        } else {
                            error = err.response
                        }
                    } else {
                        error = err
                    }
                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        GET_TRANSACTIONS({
                commit,
            },
            payload
        ) {
            const {
                route,
                page
            } = payload
            const id = route.params.id;
            const url = `${baseApiUrl}/users/${id}/wallet/transactions?page=${page}`;

            axios
                .get(url)
                .then(transactions => commit('SET_TRANSACTIONS', transactions))
                .catch(err => {
                    this.$store.commit('activeSnackbar', err.data, {
                        root: true
                    });
                });
        },
        GET_WALLET({
            commit
        }, route) {
            const id = route.params.id;
            const url = `${baseApiUrl}/users/${id}/wallet`;

            axios
                .get(url)
                .then(wallet => commit('SET_WALLET', wallet))
                .catch(err => {
                    this.$store.commit('activeSnackbar', err.data, {
                        root: true
                    });
                });
        }

    }
}