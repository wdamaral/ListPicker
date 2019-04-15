import axios from 'axios'

import {
    baseApiUrl
} from '@/global'
export default {
    strict: true,
    namespaced: true,
    state: {
        data: {},
        stores: [],
        mode: 'save',
        fileUrl: '',
        showPreview: false
    },
    mutations: {
        SET_STORES(state, payload) {
            state.stores = payload
        },
        resetAll(state) {
            state.data = {}
            state.fileUrl = ''
            state.showPreview = false
        },
        fileName(state, payload) {
            state.fileUrl = payload.fileUrl
            state.showPreview = payload.showPreview
        },
        storeLogoPicture(state) {
            state.data.imageUrl = state.fileUrl
        }
    },
    getters: {
        getImageUrl(state) {
            return state.fileUrl
        },
        GET_STORES(state) {
            return state.stores
        },
        GET_SELECTED_STORE_IMAGE: (state) => (payload) => {
            if (state.stores.stores) {

                let store = state.stores.stores.find(store => store.id === payload)
                return store.imageUrl
            }
        },
        GET_PAGINATION(state) {
            return state.stores.pagination
        }
    },
    actions: {
        SAVE({
            commit,
            dispatch
        }, payload) {
            const {
                store
            } = payload
            const method = store.id ? 'put' : 'post'
            const id = store.id ? `/${store.id}` : ''

            axios[method](`${baseApiUrl}/stores${id}`, store)
                .then(() => {
                    let msg
                    if (id) {
                        msg = 'Success! Store updated.'
                    } else {
                        msg = 'Success! Store created.'
                    }
                    commit('activeSnackbar', msg, {
                        root: true
                    })
                    dispatch('GET_STORES')
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
        UPLOAD({
            commit
        }, event) {
            const url = `${baseApiUrl}/temp`
            let data = new FormData()
            let file = event.target.files[0]
            if (!file) {
                return commit('activeSnackbar', 'No files selected', {
                    root: true
                })
            }

            data.append('name', 'my-file')
            data.append('file', file)

            let config = {
                header: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            axios.post(url, data, config).then(
                response => {
                    commit('activeSnackbar', 'Picture uploaded.', {
                        root: true
                    })
                    return response.data.filePath
                }).catch(err => {
                let error
                if (err.response.data) {
                    error = err.response.data
                } else {
                    error = err
                }
                commit('activeSnackbar', error, {
                    root: true
                })
                return 'fail'
            })
        },
        GET_STORES({
            commit
        }) {
            const url = `${baseApiUrl}/stores`

            axios
                .get(url)
                .then(stores =>
                    commit('SET_STORES', stores.data))
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
        REMOVE({
            commit,
            dispatch
        }, store) {
            const url = `${baseApiUrl}/stores/${store.id}`

            axios
                .delete(url)
                .then(() => {
                    commit('activeSnackbar', 'Store removed.', {
                        root: true
                    })
                    dispatch('GET_STORES')
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
        }
    }
}