import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import store from './modules/store'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        store
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
        }
    }
})