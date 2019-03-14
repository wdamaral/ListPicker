import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminHome from '@/components/admin/AdminHome'
import Dashboard from '@/components/admin/Dashboard'
import StoreAdmin from '@/components/admin/store/StoreAdmin'
import SignIn from '@/components/user/SignIn'
import EditUser from '@/components/user/EditUser'
import UserProfile from '@/components/user/UserProfile'

Vue.use(VueRouter)

const routes = [{
        name: 'home',
        path: '/',
        component: Home
    },  
    {
        path: '/admin',
        component: AdminHome,
        children: [
            {path: '', component: Dashboard},
            {path: 'stores', component: StoreAdmin},
        ]
    },
    {   name: 'signin',
        path: '/signin',
        component: SignIn
    },
    {   name: 'userEdit',
        path: '/user/:id/edit',
        component: EditUser
    },
    {   name: 'userProfile',
        path: '/user/:id',
        component: UserProfile
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router