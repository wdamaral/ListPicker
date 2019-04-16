import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

import Home from '@/components/home/Home'
import NotFound from '@/components/template/NotFound'
import Forbidden from '@/components/template/Forbidden'
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
import WalletHome from '@/components/wallet/WalletHome'
import UserHome from '@/components/user/UserHome'

import {
    userKey,
    baseApiUrl
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
        name: '404',
        path: '/404',
        component: NotFound
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
                redirect: 'stores'
            },
            {
                path: 'stores',
                component: StoreAdmin
            },
        ]
    },
    {
        path: '/users/:id',
        component: UserHome,
        children: [{
                name: 'userProfile',
                path: '',
                component: UserProfile
            },
            {
                name: 'userEdit',
                path: 'edit',
                component: EditUser,
                meta: {
                    requiresAdmin: true,
                    requiresUser: true
                }
            },
            {
                name: 'wallet',
                path: 'wallet',
                component: WalletHome,
            },
        ]
    },
    {
        path: '/lists',
        component: List,
        children: [{
                path: '',
                component: Lists
            },
            {
                name: 'newList',
                path: 'new',
                component: NewList
            },
            {
                name: 'myLists',
                path: 'mylists',
                component: Lists
            },
            {
                name: 'myPicks',
                path: 'mypicks',
                component: Lists
            },
            {
                name: 'history',
                path: 'history',
                component: Lists
            },
            {
                name: 'listDetails',
                path: ':id',
                component: ListDetails
            },
            {
                name: 'listEdit',
                path: ':id/edit',
                component: EditList,
                meta: {
                    requiresOwner: true
                }
            }
        ]
    },
    {
        name: 'fobidden',
        path: '/403',
        component: Forbidden
    },
    {
        name: 'all',
        path: '*',
        redirect: '/404'

    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = ['home', 'signin', 'forgotPassword', 'resetPassword', 'login', 'all', 'fobidden'];
    const authRequired = !publicPages.includes(to.name);

    const loggedIn = localStorage.getItem(userKey);
    const user = JSON.parse(loggedIn)


    if (authRequired && !loggedIn) {
        return next('/login')
    }

    if (user && to.path === '/login') next({
        path: '/lists'
    })

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


        if (user && user.admin) return next()

        if (user && user.id == to.params.id) return next()
        return next({
            path: '/404'
        })
    }

    if (to.matched.some(record => record.meta.requiresOwner)) {
        const id = to.params.id
        const url = `${baseApiUrl}/validate-list/${id}`

        return axios
            .get(url)
            .then(list => {

                if (user && (list.data.ownerId === user.id) && !list.data.pickerId) return next()

                return next({
                    path: '/403'
                })
            })
            .catch(err => next({
                path: '/404'
            }))
    }

    next()
})

export default router