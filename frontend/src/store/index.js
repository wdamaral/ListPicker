import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import store from './modules/store'
import list from './modules/list'
import wallet from './modules/wallet'
import {
    baseApiUrl
} from '@/global'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        store,
        list,
        wallet
    },
    state: {
        isMenuVisible: true,
        snackbar: false,
        snackText: null,
        timeout: 4000
    },
    mutations: {
        activeSnackbar(state, payload) {
            state.snackText = payload
            state.snackbar = true
            setTimeout(() => {
                state.snackbar = false
            }, state.timeout);
        },
        hideSnackbar(state) {
            state.snackText = null,
                state.snackbar = false
        }
    },
    actions: {
        UPLOAD({
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

            return axios.post(url, data, config).then(
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
                return null
            })
        },
    }
})