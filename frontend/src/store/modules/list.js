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
        //itemIndex: -1,
        //listSelected: -1,
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
        }
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