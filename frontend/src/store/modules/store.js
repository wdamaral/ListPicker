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
           let store = state.stores.stores.find(store => store.id === payload)
            return store.imageUrl
        }
    },
    actions: {
        save({
            commit,
            state
        }) {
            const method = state.data.id ? 'put' : 'post'
            const id = state.data.id ? `/${state.data.id}` : ''
            commit('storeLogoPicture')
            axios[method](`${baseApiUrl}/stores/${id}`, state.data)
                .then(() => {
                    commit('activeSnackbar', 'Success! Store created.', {
                        root: true
                    })
                    commit('resetAll')
                    //router.push('/')
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
        upload({
            commit
        }, event) {
            const url = `${baseApiUrl}/upload`
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
                    commit('fileName', {
                        fileUrl: response.data.filePath,
                        showPreview: true
                    })
                    commit('activeSnackbar', 'Picture uploaded.', {
                        root: true
                    })
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
        }
    }
}