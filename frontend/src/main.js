import 'font-awesome/css/font-awesome.min.css'
import Vue from 'vue'

import App from './App.vue'

import './config/bootstrap'
import './config/messages'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

require('axios').defaults.headers.common['Authorization'] = 
    'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiV2FnbmVyIiwibGFzdE5hbWUiOiJEJ0FtYXJhbCIsImVtYWlsIjoid3JkYW1hcmFsQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDE5LTAyLTIwVDAyOjEyOjQ5LjU1NVoiLCJ1cGRhdGVkQXQiOm51bGwsImlhdCI6MTU1MTU2MjQ2NiwiZXhwIjoxNTUxNjQ4ODY2fQ.b3sTyGiizvrkT-pW60or_g9qdWT3JiXdL-YyoUdx-2c'

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
