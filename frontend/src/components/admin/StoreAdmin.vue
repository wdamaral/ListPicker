<template>
    <div class="store-admin">
        <b-form>
            <input id="store-id" type="hidden" v-model="store.id">
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Store name" label-for="store-name">
                        <b-form-input id="store-name" type="text" 
                            v-model="store.name" required
                            :readonly="mode === 'remove'"
                            placeholder="Store name"/>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Description" label-for="store-description">
                        <b-form-input id="store-description" type="text" 
                            v-model="store.description" required
                            :readonly="mode === 'remove'"
                            placeholder="Store description"/>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="9" sm="9">
                    <b-form-group label="Logo" label-for="file-input">
                        <b-form-file accept="image/jpeg, image/jpg image/png, image/gif" 
                            @change="upload($event)" 
                            id="file-input"
                            placeholder="Choose a file..."
                            drop-placeholder="Drop file here..."/>
                    </b-form-group>
                </b-col>
                <b-col md="3" sm="3" center>
                    <b-img v-bind="logoProps" :src="getImageUrl" v-show="showPreview" rounded thumbnail fluid/>
                </b-col>
            </b-row>
            <b-row class="mb-3">
                <b-col xs="12">
                    <b-button variant="primary" v-if="mode === 'save'"
                        @click="save">Save</b-button>
                    <b-button variant="danger" v-if="mode === 'remove'"
                        @click="remove">Remove store
                    </b-button>
                    <b-button class="ml-2" @click="reset">Cancel</b-button>
                </b-col>
            </b-row>
        </b-form>
        <b-table hover striped :items="stores" :fields="fields">
            <template slot="image" slot-scope="data">
                <b-img v-bind="logoProps" :src="data.fileUrl" rounded thumbnail fluid/>
            </template>
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadstore(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadstore(data.item, 'remove')" class="mr-2">
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
    name: 'StoreAdmin',
    data: function() {
        return {
            mode: 'save',
            fileUrl: '',
            showPreview: false,
            store: {},
            stores: [],
            fields: [
                { key: 'id', label: 'Store ID', sortable: true },
                { key: 'name', label: 'Store name', sortable: true },
                { key: 'description', label: 'Description' },
                { key: 'image', label: 'Logo'},
                { key: 'actions', label: 'Actions'}
            ],
            logoProps: { width: 50, height: 20, class: 'm1' }
        }
    },
    computed: {
        getImageUrl: function() {
            return this.fileUrl
        }
    },
    methods: {
        loadstores() {
            const url = `${baseApiUrl}/stores`
            axios.get(url).then(res => {
                this.stores = res.data.stores
            })
        },
        reset() {
            this.mode = 'save'
            this.store = {}
            this.loadstores()
        },
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
        save() {

            
            const method = this.store.id ? 'put' : 'post'
            const id = this.store.id ? `/${this.store.id}` : ''
            this.store.imageUrl = this.data.fileUrl
            axios[method](`${baseApiUrl}/stores/${id}`, this.store)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        remove() {
            const id = this.store.id
            axios.delete(`${baseApiUrl}/stores/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadstore(store, mode = 'save') {
            this.mode = mode
            this.store = { ...store }
        }
    },
    mounted() {
        this.loadstores()
    }
}
</script>

<style>

</style>
