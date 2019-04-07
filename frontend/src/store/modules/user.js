import axios from 'axios'

import {
    baseApiUrl,
    userKey
} from '@/global'
export default {
    namespaced: true,
    state: {
        data: {},
        auth: null,
        users: [],
        step: 0,
        mode: 'save',
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
            state.userRegistration = {}
            state.step = 0
            state.fileUrl = ''
            state.showPreview = false
        },
        SET_USER(state, payload) {
            state.data = payload
        },
        SET_AUTH(state, payload) {
            state.auth = payload
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
        },
        SET_PROFILE_PICTURE(state, payload) {
            state.userRegistration.profilePicture = payload
        },


    },
    getters: {
        step(state) {
            return state.step
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

            axios.post(`${baseApiUrl}/users/`, user)
                .then(() => {
                    commit('activeSnackbar', 'Success! User created.', {
                        root: true
                    })
                    commit('resetAll')
                    router.push('/login')
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
                ...state.data
            }

            const id = user.id ? `${user.id}` : ''

            delete user.lists
            delete user.listsPick

            axios.put(`${baseApiUrl}/users/${id}`, user)
                .then(() => {
                    commit('activeSnackbar', 'Success! User saved.', {
                        root: true
                    })
                    router.push(`/users/${user.id}`)
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
        RESET_PASSWORD({
            commit
        }, payload) {

            const {
                router,
                route,
                user
            } = payload
            delete user.email
            const token = route.params.token

            const url = `${baseApiUrl}/reset-password/${token}`

            axios
                .post(url, user)
                .then(() => {
                    commit('activeSnackbar', 'Password updated.', {
                        root: true
                    })
                    router.push('/login')
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
        FORGOT_PASSWORD({
            commit
        }, payload) {
            const email = payload.email
            const url = `${baseApiUrl}/forgot-password`
            axios
                .post(url, {
                    email
                })
                .then(message => {
                    commit('activeSnackbar', message.data, {
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
        }, payload) {
            const url = `${baseApiUrl}/signin`
            const {
                user,
                router
            } = payload
            axios
                .post(url, user)
                .then(res => {
                    commit('SET_AUTH', res.data)
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
        LOGOUT({
            commit
        }, router) {
            localStorage.removeItem(userKey)
            commit('SET_AUTH', null)
            router.push({
                name: 'login'
            })
        },

        CLOSE_ACCOUNT({
            commit,
            state,
            dispatch
        }, router) {
            const id = state.data.id
            const url = `${baseApiUrl}/users/${id}`

            axios
                .delete(url)
                .then(message => {
                    dispatch('LOGOUT', router)
                    commit('activeSnackbar', message.data, {
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

        }
    }
}