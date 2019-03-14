import axios from 'axios'

import { baseApiUrl } from '@/global'
export default {
    strict: true,
    state: {
        data: {},
        step: 0,
        mode: 'save',
        fileUrl: '',
        showPreview: false
    },
    mutations: {
        nextStep(state) {
            state.step++
        },
        stepBack(state) {
            state.step--
        },
        resetStep(state) {
            state.step = 1
        },
        resetAll(state) {
            state.data = {}
            state.step = 0
        },
        fileName(state, payload) {
            state.fileUrl = payload.fileUrl
            state.showPreview = payload.showPreview
        }
    },
    getters: {
        stepNumber(state) {
            return state.step
        },
        getImageUrl(state) {
            return state.fileUrl
        }
    },
    actions: {
        save({commit, state}, router ) {
            const method = state.data.id ? 'put' : 'post'
            const id = state.data.id ? `/${state.data.id}` : ''
            axios[method](`${baseApiUrl}/users/${id}`, state.data)
            .then(() => {
                commit('activeSnackbar', 'Success! User registered.', { root: true })
                commit('resetAll')
                router.push('/')
            })
            .catch(err => {
                let error
                if(err.response.data) {
                    error = err.response.data
                } else {
                    error = err
                }
                
                commit('activeSnackbar', error, { root: true })
            })
        },
        upload({commit}, event) {
            const url = `${baseApiUrl}/upload`
            let data = new FormData()
            let file = event.target.files[0] 
            if(!file) {
                return commit('activeSnacbar', 'No files selected', { root: true })
            }
            
            data.append('name', 'my-file')
            data.append('file', file)
    
            let config = {
                header : {
                    'Content-Type' : 'multipart/form-data'
                }
            }
    
            axios.post(url, data, config).then(
                response => {
                    commit('fileName', { fileUrl: response.data.filePath, showPreview: true })
                    commit('activeSnackbar', 'Picture uploaded.', {root: true})
            }).catch(err => {
                let error
                if(err.response.data) {
                    error = err.response.data
                } else {
                    error = err
                }
                
                commit('activeSnackbar', error, { root: true })
            })
        }
    }
}