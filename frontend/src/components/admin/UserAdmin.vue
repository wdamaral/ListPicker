<template>
    <div class="user-admin">
        <b-form>
            <input id="user-id" type="hidden" v-model="user.id">
            <b-row>
                <b-col md="4" sm="12">
                    <b-form-group label="First name" label-for="user-first-name">
                        <b-form-input id="user-first-name" type="text" 
                            v-model="user.firstName" required
                            :readonly="mode === 'remove'"
                            placeholder="User's first name"/>
                    </b-form-group>
                </b-col>
                <b-col md="4" sm="12">
                    <b-form-group label="Last name" label-for="user-last-name">
                        <b-form-input id="user-last-name" type="text" 
                            v-model="user.lastName" required
                            :readonly="mode === 'remove'"
                            placeholder="User's last name"/>
                    </b-form-group>
                </b-col>
                <b-col md="3" sm="3" center>
                    <b-img v-bind="photoProps" :src="getImageUrl" v-show="showPreview" rounded thumbnail fluid/>
                    
                    <b-form-group label="Photo" label-for="file-input">
                        <b-form-file accept="image/jpeg, image/jpg image/png, image/gif" 
                            @change="upload($event)" 
                            id="file-input"
                            placeholder="Choose a file..."
                            drop-placeholder="Drop file here..."/>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="E-mail" label-for="user-email">
                        <b-form-input id="user-email" type="email" 
                            v-model="user.email" required
                            :readonly="mode === 'remove'"
                            placeholder="user@email.com"/>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Mobile number" label-for="user-phone-number">
                        <b-form-input id="user-phone-number" type="text" 
                            v-model="user.phoneNumber" required
                            :readonly="mode === 'remove'"
                            placeholder="(123)321-4545"/>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row v-show="mode === 'save'">
                <b-col md="6" sm="12">
                    <b-form-group label="Password" label-for="user-password">
                        <b-form-input id="user-password" type="password" 
                            v-model="user.password" required
                            placeholder="Password"/>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Confirm password" label-for="user-confirm-password">
                        <b-form-input id="user-confirm-password" type="password" 
                            v-model="user.confirmPassword" required
                            placeholder="Confirm password"/>
                    </b-form-group>
                </b-col>
            </b-row>
            <hr class="mt-3 mb-3">
            <b-row>
                <b-col md="8" sm="12">
                    <b-form-group label="Street" label-for="user-street">
                        <b-form-input id="user-street" type="text" 
                            v-model="user.street" required
                            :readonly="mode === 'remove'"
                            placeholder="1234 User's street name"/>
                    </b-form-group>
                </b-col>
                <b-col md="4" sm="12">
                    <b-form-group label="#Unit" label-for="user-unit">
                        <b-form-input id="user-unit" type="text"
                            :readonly="mode === 'remove'" 
                            v-model="user.unit"
                            placeholder="#Unit"/>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="4" sm="4">
                    <b-form-group label="Postal code" label-for="user-postal-code">
                        <b-form-input id="user-postal-code" type="text" 
                            v-model="user.postalCode" required
                            :readonly="mode === 'remove'"
                            placeholder="A1A 1A1"/>
                    </b-form-group>
                </b-col>
                <b-col md="4" sm="4">
                    <b-form-group label="City" label-for="user-city">
                        <b-form-input id="user-city" type="text" 
                            v-model="user.city" required
                            :readonly="mode === 'remove'"
                            placeholder="City"/>
                    </b-form-group>
                </b-col>
                <b-col md="4" sm="4">
                    <b-form-group label="Province" label-for="user-province">
                        <b-form-input id="user-province" type="text" 
                            v-model="user.province" required
                            placeholder="ON"
                            :readonly="mode === 'remove'"
                            :state="isProvinceValid"
                            />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode === 'save'"
                        @click="save">Save</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'"
                        @click="remove">Close account
                    </b-button>
                    <b-button class="ml-2" @click="reset">Cancel</b-button>
                </b-col>
            </b-row>
        </b-form>
        <b-table hover striped :items="users" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadUser(data.item, 'remove')" class="mr-2">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'

export default {
    name: 'UserAdmin',
    data: function() {
        return {
            mode: 'save',
            fileUrl: '',
            showPreview: false,
            user: {},
            users: [],
            fields: [
                { key: 'id', label: 'User ID', sortable: true },
                { key: 'firstName', label: 'First name', sortable: true },
                { key: 'lastName', lable: 'Last name', sortable: true },
                { key: 'email', label: 'E-mail', sortable: true },
                { key: 'actions', label: 'Actions'}
            ],
            photoProps: { width: 80, height: 80, class: 'm1' }
        }
    },
    computed: {
        getImageUrl: function() {
            return this.fileUrl
        }
    },
    methods: {
        upload(event) {
        const url = `${baseApiUrl}/upload`
        let data = new FormData()
        let file = event.target.files[0]
        
        data.append('name', 'my-file')
        data.append('file', file)

        let config = {
            header : {
                'Content-Type' : 'multipart/form-data'
            }
        }

        axios.post(url, data, config).then(
            response => {
                this.fileUrl = response.data.filePath
                this.$toasted.global.defaultSuccess()
                this.showPreview = true
        }).catch(showError)
    },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data.users
            })
        },
        reset() {
            this.mode = 'save'
            this.user = {}
            this.loadUsers()
        },
        save() {
            const method = this.user.id ? 'put' : 'post'
            const id = this.user.id ? `/${this.user.id}` : ''
            this.user.picture = this.data.fileUrl
            axios[method](`${baseApiUrl}/users/${id}`, this.user)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.user.id
            axios.delete(`${baseApiUrl}/users/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadUser(user, mode = 'save') {
            this.mode = mode
            this.user = { ...user }
        }
    },
    computed: {
        isProvinceValid() {
            return  true//this.user.province.length <= 2
        }
    },
    mounted() {
        this.loadUsers()
    }
}
</script>

<style>

</style>
