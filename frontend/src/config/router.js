import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminHome from '@/components/admin/AdminHome'
import Dashboard from '@/components/admin/Dashboard'
import StoreAdmin from '@/components/admin/store/StoreAdmin'
import SignIn from '@/components/user/SignIn'
import EditUser from '@/components/user/EditUser'
import UserProfile from '@/components/user/UserProfile'
import List from '@/components/list/List'
import NewList from '@/components/list/NewList'
import EditList from '@/components/list/EditList'
import Lists from '@/components/list/Lists'
import ListDetails from '@/components/list/ListDetails'
import Login from '@/components/auth/Login'

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
        path: '/users/:id/edit',
        component: EditUser
    },
    {   name: 'userProfile',
        path: '/users/:id',
        component: UserProfile
    },
    {
        path: '/lists',
        component: List,
        children: [
            { path: '', component: Lists },
            { path: 'new', component: NewList },
            { path: ':id', component: ListDetails },
            { path: ':id/edit', component: EditList },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router