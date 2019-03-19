import axios from 'axios'

import { baseApiUrl } from '@/global'
export default {
    strict: true,
    namespaced: true,
    state: {
        data: {},
        users: [],
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
            state.fileUrl = ''
            state.showPreview = false
        },
        fileName(state, payload) {
            state.fileUrl = payload.fileUrl
            state.showPreview = payload.showPreview
        },
        userProfilePicture(state) {
            state.data.profilePicture = state.fileUrl
        },
        SET_USER(state, payload) {
            state.data = payload
        },
        SET_USERS(state, payload) {
            state.users = payload
        },
        SET_PASSWORD(state, payload) {
            state.data.password = payload
        },
        SET_CONFIRMPASSWORD(state, payload) {
            state.data.confirmPassword = payload
        }


    },
    getters: {
        step(state) {
            return state.step
        },
        imageUrl(state) {
            return state.fileUrl
        },
        activeLists(state) {
            return state.data.lists.filter(list => list.pickerId === null)
        },
        lastDeliveryConfirmed(state) {
            if (state.data.lists) {
                return state.data.listsPick.reduce((m, i) => (i.deliveredAt > m) && i || m, "")
                         .deliveredAt;
             }
        },
        lastListPicked(state) {
            if (state.data.listsPick) {
                return state.data.lists.reduce((m, i) => (i.pickedAt > m) && i || m, "")
                         .pickedAt;
             }   
        },
        lastListFulfilled(state) {
            if (state.data.lists) {
                return state.data.lists.reduce((m, i) => (i.confirmedAt > m) && i || m, "")
                         .confirmedAt;
             }
        }

    },
    actions: {
        insert({commit, state}, router ) {
            const user = {...state.data}

            const method = user.id ? 'put' : 'post'
            const id = user.id ? `${user.id}` : ''
            if(state.fileUrl !== user.profilePicture) {
                commit('userProfilePicture')
                user.profilePicture = state.fileUrl
            } else {
                delete user.profilePicture
            }
            
            axios[method](`${baseApiUrl}/users/${id}`, user)
            .then(() => {
                commit('activeSnackbar', 'Success! User created.', { root: true })
                commit('resetAll')
                router.go('/login')
            })
            .catch(err => {
                let error
                if(err.response) {
                    if(err.response.data) {
                        error = err.response.data
                    } else {
                        error = err.response
                    }
                } else {
                    error = err
                }
                commit('activeSnackbar', error, { root: true })
            })
        },
        update({commit, state}, router) {
            const user = {...state.data}

            const method = user.id ? 'put' : 'post'
            const id = user.id ? `${user.id}` : ''
            if(state.fileUrl !== '') {
                commit('userProfilePicture')
                user.profilePicture = state.fileUrl
            }
            delete user.lists
            delete user.listsPick
            
            axios[method](`${baseApiUrl}/users/${id}`, user)
            .then(() => {
                commit('activeSnackbar', 'Success! User saved.', { root: true })
                router.go()
            })
            .catch(err => {
                let error
                if(err.response) {
                    if(err.response.data) {
                        error = err.response.data
                    } else {
                        error = err.response
                    }
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
                return commit('activeSnackbar', 'No files selected', { root: true })
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
            })
            .catch(err => {
                let error
                if(err.response) {
                    if(err.response.data) {
                        error = err.response.data
                    } else {
                        error = err.response
                    }
                } else {
                    error = err
                }
                
                commit('activeSnackbar', error, { root: true })
            })
        },
        getUser({commit}, id) {
            const url = `${baseApiUrl}/users/${id}`
            axios
                .get(url)
                .then(user => {
                    commit('SET_USER', user.data)
                })
                .catch(err => {
                    let error
                    if(err.response) {
                        if(err.response.data) {
                            error = err.response.data
                        } else {
                            error = err.response
                        }
                    } else {
                        error = err
                    }
                    commit('activeSnackbar', error, { root: true })
                })
        }

    }
}