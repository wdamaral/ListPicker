import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import * as VueGoogleMaps from 'vue2-google-maps'

import App from './App.vue'

import './config/bootstrap'
import './config/messages'
import store from './store'
import router from './config/router'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB-V4zSeEhvkSC1QXGvkFNAc3dKJEsjvF8'
  },
  autobindAllEvents: false,
  installComponents: true
})
Vue.use(require('vue-moment'))

Vue.config.productionTip = false


require('axios').defaults.headers.common['Authorization'] = 
    'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiV2FnbmVyIiwibGFzdE5hbWUiOiJEJ0FtYXJhbCIsImVtYWlsIjoid3JkYW1hcmFsQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDE5LTAzLTA2VDAyOjAyOjI0LjgxNloiLCJ1cGRhdGVkQXQiOm51bGwsImlhdCI6MTU1MjUyMDA1MiwiZXhwIjoxNTUyNjA2NDUyfQ.Rgz44Xq2SsndSt855wECjfJveGAJlGO4gSVBHYqNLo4'

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
