import axios from 'axios'

import {
    baseApiUrl,
    userKey
} from '@/global'
export default {
    namespaced: true,
    state: {
        data: null,
        users: [],
        step: 0,
        mode: 'save',
        fileUrl: '',
        showPreview: false,
        userRegistration: {}
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
            state.userRegistration = state.fileUrl
        },
        SET_USER(state, payload) {
            state.data = payload
            if (payload) {
                axios.defaults.headers.common['Authorization'] = `bearer ${payload.token}`
            } else {
                delete axios.defaults.headers.common['Authorization']
            }
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

    },
    actions: {
        insert({
            commit,
            state
        }, router) {
            const user = {
                ...state.userRegistration
            }

            const method = user.id ? 'put' : 'post'
            const id = user.id ? `${user.id}` : ''
            if (state.fileUrl !== user.profilePicture) {
                commit('userProfilePicture')
                user.profilePicture = state.fileUrl
            } else {
                delete user.profilePicture
            }

            axios[method](`${baseApiUrl}/users/${id}`, user)
                .then(() => {
                    commit('activeSnackbar', 'Success! User created.', {
                        root: true
                    })
                    commit('resetAll')
                    router.go('/login')
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
        update({
            commit,
            state
        }, router) {
            const user = {
                ...state.userRegistration
            }

            const method = user.id ? 'put' : 'post'
            const id = user.id ? `${user.id}` : ''
            if (state.fileUrl !== '') {
                commit('userProfilePicture')
                user.profilePicture = state.fileUrl
            }
            delete user.lists
            delete user.listsPick

            axios[method](`${baseApiUrl}/users/${id}`, user)
                .then(() => {
                    commit('activeSnackbar', 'Success! User saved.', {
                        root: true
                    })
                    router.push(`/user/${user.id}`)
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
        getUser({
            commit
        }, id) {
            const url = `${baseApiUrl}/users/${id}`
            axios
                .get(url)
                .then(user => {
                    commit('SET_USER', user.data)
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
        LOGIN({
            commit
        }, {payload, router}) {
            const url = `${baseApiUrl}/signin`
            axios
                .post(url, payload)
                .then(res => {
                    commit('SET_USER', res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    router.push('/lists')
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
        LOGOUT({ commit }, router) {
            localStorage.removeItem(userKey)
            commit('SET_USER', null)
            router.push({name: 'login'})
        }
    }
}