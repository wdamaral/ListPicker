import 'font-awesome/css/font-awesome.min.css'
import Vue from 'vue'

import App from './App.vue'

import './config/bootstrap'
import './config/messages'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

require('axios').defaults.headers.common['Authorization'] = 
    'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiV2FnbmVyIiwibGFzdE5hbWUiOiJEJ0FtYXJhbCIsImVtYWlsIjoid3JkYW1hcmFsQGdtYWlsLmNvbSIsImFkbWluIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAxOS0wMi0yMFQwMjoxMjo0OS41NTVaIiwidXBkYXRlZEF0IjpudWxsLCJpYXQiOjE1NTE0OTA4NDMsImV4cCI6MTU1MTU3NzI0M30.tZkJBkXycKlWaYEopnY4LEz7raKdozGHbJhtbntnRMg'

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
