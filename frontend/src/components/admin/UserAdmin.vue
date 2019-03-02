<template>
    <div class="user-admin">
        <b-table hover striped :items="users" :fields="fields"></b-table>
    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
    name: 'UserAdmin',
    data: function() {
        return {
            mode: 'save',
            user: {},
            users: [],
            fields: [
                { key: 'id', label: 'User ID', sortable: true },
                { key: 'firstName', label: 'First name', sortable: true },
                { key: 'lastName', lable: 'Last name', sortable: true },
                { key: 'email', label: 'E-mail', sortable: true }
            ]
        }
    },
    methods: {
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data.users
            })
        }
    },
    mounted() {
        this.loadUsers()
    }
}
</script>

<style>

</style>
