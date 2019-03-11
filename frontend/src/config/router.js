import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import Admin from '@/components/admin/Admin'
import Dashboard from '@/components/admin/Dashboard'
import StoreAdmin from '@/components/admin/StoreAdmin'
import SignIn from '@/components/user/SignIn'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home
},
{
    name: 'admin',
    path: '/admin',
    component: Admin,
    children: [
        {path: '', component: Dashboard},
        {path: 'stores', component: StoreAdmin},
    ]
},
{   name: 'signin',
    path: '/signin',
    component: SignIn
}
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router