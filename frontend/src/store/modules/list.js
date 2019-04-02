import axios from 'axios'

import {
    baseApiUrl
} from '@/global'

export default {
    namespaced: true,
    state: {
        lists: [],
        list: {
            listItems: []
        },
        editedItem: {},
        addItemModal: false,
        mode: 'NEW'

    },
    mutations: {
        SET_LISTS(state, payload) {
            state.lists = payload
        },
        SET_LIST(state, payload) {
            state.list = payload
        },
        SHOW_MODAL(state) {
            state.addItemModal = !state.addItemModal
        },
        SET_EDITED_ITEM(state, payload) {
            state.editedItem = payload
        },
        DELETE_ITEM(state, payload) {
            state.list.listItems.splice(payload, 1)
        },
        ADD_ITEM(state, payload) {
            state.list.listItems.push(payload)
        },
        SET_MODE(state, payload) {
            state.mode = payload
        },
        SET_SELECTED_LIST(state, payload) {
            state.selectedList = payload
        },
        SET_BOUGHT(state, payload) {
            state.boughtAt = payload
        },
        SET_DELIVERED(state) {
            state.deliveredAt = Date.now
        },
        SET_CONFIRMED(state) {
            state.confirmedAt = Date.now
        },
        SET_IS_BOUGHT(state, payload) {
            state.list.isBought = payload
        },
        SET_IS_DELIVERED(state, payload) {
            state.list.isDelivered = payload
        },
        SET_IS_CONFIRMED(state, payload) {
            state.list.isConfirmed = payload
        }
    },
    getters: {
        GET_LIST(state) {
            return state.list
        },
        GET_LISTS(state) {
            return state.lists
        },
        GET_EDITED_ITEM(state) {
            return state.editedItem
        },
        GET_MODE(state) {
            return state.mode
        },
        GET_ITEMS_LENGTH(state) {
            return state.list.listItems.length
        },
        GET_BOUGHT(state) {
            return state.list.boughtAt
        },
        GET_DELIVERED(state) {
            return state.list.deliveredAt
        },
        GET_CONFIRMED(state) {
            return state.list.confirmedAt
        },

    },
    actions: {
        INSERT({
            commit,
            state
        }, router) {

            axios['post'](`${baseApiUrl}/lists`, state.list)
                .then(() => {
                    commit('activeSnackbar', 'Success! List created.', {
                        root: true
                    })
                    commit('list/SET_LIST', {})
                    router.push('/lists')
                })
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }
                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        UPDATE({
            commit,
            state
        }, router) {
            const id = state.data.id ? `/${state.data.id}` : ''

            axios['put'](`${baseApiUrl}/lists/${id}`, state.list)
                .then(() => {
                    commit('activeSnackbar', 'Success! List updated.', {
                        root: true
                    })
                    router.push('/lists')
                })
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }

                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        PICKER_UPDATE_LIST({
            commit,
            dispatch,
            state
        }) {
            const editedItem = {
                cost: state.editedItem.cost,
                qtyBought: state.editedItem.qtyBought
            }

            const url = `${baseApiUrl}/lists/${state.list.id}/items/${state.editedItem.id}`

            axios
                .put(url, editedItem)
                .then(() => {
                    commit('activeSnackbar', 'Success! Item updated.', {
                        root: true
                    })
                    dispatch('GET_LIST', state.list.id)
                    commit('SET_EDITED_ITEM', {})
                })
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }

                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        UPDATE_STATUS({
            commit,
            dispatch,
            state
        }, status) {
            let url = `${baseApiUrl}/lists/${state.list.id}`
            let newStatus
            if (status === 'bought') {
                console.log('bought')
                url += '/bought'
            }
            if (status === 'delivered') {
                url += '/delivered'
            }
            if (status === 'confirmed') {
                url += '/confirmed'
            }
            axios
                .put(url, newStatus)
                .then(() => {
                    commit('activeSnackbar', 'Success! Status updated.', {
                        root: true
                    })
                    dispatch('GET_LIST', state.list.id)
                })
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }

                    commit('activeSnackbar', error, {
                        root: true
                    })
                    if (status === 'bought') {
                        commit('SET_IS_BOUGHT', false)
                    }
                    if (status === 'delivered') {
                        commit('SET_IS_DELIVERED', false)
                    }
                    if (status === 'confirmed') {
                        commit('SET_IS_CONFIRMED', false)
                    }
                })
        },
        PICK_LIST({
            commit,
            dispatch,
            state
        }) {
            const url = `${baseApiUrl}/lists/${state.list.id}/pick`

            axios
                .post(url)
                .then(() => {
                    commit('activeSnackbar', `You've picked this list`, {
                        root: true
                    })
                    dispatch('GET_LIST', state.list.id)
                })
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }
                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        SAVE_RECEIPT({
            commit,
            dispatch,
            state
        }) {
            const url = `${baseApiUrl}/lists/${state.list.id}`

            axios
                .put(url, state.list.receiptNumber)
                .then(() => {
                    dispatch('GET_LIST', state.list.id)

                    commit('activeSnackbar', 'Success! Status updated.', {
                        root: true
                    })

                })
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }

                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        REMOVE_LIST({
            commit,
            state
        }, router) {
            const url = `${baseApiUrl}/lists/${state.selectedList}`

            axios
                .delete(url)
                .then(() => {
                    commit('activeSnackbar', 'List removed.', {
                        root: true
                    })
                    router.push('/lists')
                })
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }

                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        GET_LISTS({
            commit
        }) {
            const url = `${baseApiUrl}/lists`

            axios
                .get(url)
                .then(lists =>
                    commit('SET_LISTS', lists.data))
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }

                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        GET_LIST({
            commit
        }, id) {
            const url = `${baseApiUrl}/lists/${id}`
            axios
                .get(url)
                .then(list =>
                    commit('SET_LIST', list.data))
                .catch(err => {
                    let error
                    if (err.response.data) {
                        error = err.response.data
                    } else {
                        error = err
                    }

                    commit('activeSnackbar', error, {
                        root: true
                    })
                })
        },
        SAVE_ITEM_DB({
            dispatch,
            commit,
            state
        }) {

            if (state.selectedList > 0) {
                let url = `${baseApiUrl}/lists/${state.selectedList}/items`
                state.editedItem.listId = state.selectedList
                axios
                    .post(url, state.editedItem)
                    .then(() => {
                        dispatch('GET_LIST', state.selectedList)
                    })
                    .catch(err => {
                        let error
                        if (err.response.data) {
                            error = err.response.data
                        } else {
                            error = err
                        }

                        commit('activeSnackbar', error, {
                            root: true
                        })
                    })
            } else {
                commit('activeSnackbar', 'List not selected.', {
                    root: true
                })
            }
        },
        DELETE_ITEM_DB({
            dispatch,
            commit,
            state
        }, payload) {
            const listId = state.list.id
            if (listId > 0) {
                const url = `${baseApiUrl}/lists/${listId}/items/${payload}/delete`
                axios
                    .delete(url)
                    .then(() => {
                        dispatch('GET_LIST', listId)
                    })
                    .catch(err => {
                        let error
                        if (err.response.data) {
                            error = err.response.data
                        } else {
                            error = err
                        }

                        commit('activeSnackbar', error, {
                            root: true
                        })
                    })
            } else {
                commit('activeSnackbar', 'List not selected.', {
                    root: true
                })
            }
        }
    }
}