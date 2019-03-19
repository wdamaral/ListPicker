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


require('axios').defaults.headers.common['Authorization'] = 
    'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiV2FnbmVyIiwibGFzdE5hbWUiOiJEJ0FtYXJhbCIsImVtYWlsIjoid3JkYW1hcmFsQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDE5LTAzLTA2VDAyOjAyOjI0LjgxNloiLCJ1cGRhdGVkQXQiOm51bGwsImlhdCI6MTU1MzAwNzMyNiwiZXhwIjoxNTUzMDkzNzI2fQ.iyKZcVH65nI4xczTyaEwywgwAnL07AZ7oedawKyWR7E'

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
