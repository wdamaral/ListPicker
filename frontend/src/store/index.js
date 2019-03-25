import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import store from './modules/store'
import list from './modules/list'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        store,
        list
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
            setTimeout(() => { state.snackbar = false }, state.timeout);
        },
        hideSnackbar(state) {
            state.snackText = null,
            state.snackbar = false
        }
    }
})