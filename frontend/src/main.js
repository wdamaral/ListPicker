import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import * as VueGoogleMaps from 'vue2-google-maps'

import App from './App.vue'

import store from './store'
import router from './config/router'

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAPS_KEY
  },
  autobindAllEvents: false,
  installComponents: true
})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
