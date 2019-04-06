import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios';

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
import PasswordChange from '@/components/auth/PasswordChange'
import {
    baseApiUrl,
    userKey
} from '@/global'

Vue.use(VueRouter)

const routes = [
    //unprotected routes
    {
        name: 'home',
        path: '/',
        component: Home
    },
    {
        name: 'forgotPassword',
        path: '/forgot-password',
        component: PasswordChange
    },
    {
        name: 'resetPassword',
        path: '/reset-password/:token',
        component: PasswordChange
    },
    {
        name: 'signin',
        path: '/signin',
        component: SignIn
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    //protected routes
    {
        path: '/admin',
        component: AdminHome,
        meta: {
            requiresAdmin: true
        },
        children: [{
                path: '',
                component: Dashboard
            },
            {
                path: 'stores',
                component: StoreAdmin
            },
        ]
    },
    {
        name: 'userEdit',
        path: '/users/:id/edit',
        component: EditUser
    },
    {
        name: 'userProfile',
        path: '/users/:id',
        component: UserProfile
    },
    {
        path: '/lists',
        component: List,
        children: [{
                path: '',
                component: Lists
            },
            {
                path: 'new',
                component: NewList
            },
            {
                path: 'mylists',
                component: Lists
            },
            {
                path: 'mypicks',
                component: Lists
            },
            {
                path: 'history',
                component: Lists
            },
            {
                path: ':id',
                component: ListDetails
            },
            {
                path: ':id/edit',
                component: EditList
            },
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = ['home', 'signin', 'forgotPassword', 'resetPassword', 'login'];
    const authRequired = !publicPages.includes(to.name);

    const loggedIn = localStorage.getItem(userKey);

    if (authRequired && !loggedIn) {
        return next('/login')
    }

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        //implement request => 2nd version
        // const url = `${baseApiUrl}/validate-admin`
        // return axios
        //     .post(url, loggedIn)
        //     .then(admin => {
        //         if (admin) return next()
        //         return next({
        //             path: '/login'
        //         })
        //     })
        //     .catch(err => next({
        //         path: '/'
        //     }))
        const user = JSON.parse(loggedIn)
        if (user && user.admin) return next()
        return next({
            path: '/'
        })
    }
    next()
})

export default router