import axios from 'axios'

import { baseApiUrl } from '@/global'
export default {
    strict: true,
    state: {
        data: {},
        step: 0,
        mode: 'save',
        fileUrl: '',
        showPreview: false,
        snackbar: false,
        snackText: null,
        timeout: 3000
    },
    mutations: {
        nextStep(state) {
            state.step++
        },
        resetStep(state) {
            state.step = 1
        }
    },
    getters: {
        stepNumber(state) {
            return state.step
        }
    },
    actions: {
        save(context) {
            const method = context.state.data.id ? 'put' : 'post'
            const id = context.state.data.id ? `/${context.state.data.id}` : ''
            axios[method](`${baseApiUrl}/users/${id}`, context.state.data)
            .then(() => {
                context.state.snackbar = true
                context.state.text = 'Success! User registered.'
                context.state.date = {}
            })
            .catch(err => {
                let error = err.response.data
                context.state.text = error
                context.state.snackbar = true
            })
        }
    }
}