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
                <b-col md="12" sm="12">
                    <b-form-group label="Logo" label-for="store-image-url">
                        <b-form-input id="store-image-url" type="text" 
                            v-model="store.imageUrl" required
                            :readonly="mode === 'remove'"/>
                    </b-form-group>
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
                <b-img v-bind="logoProps" :src="data.item.imageUrl" rounded thumbnail fluid/>
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
            store: {},
            stores: [],
            fields: [
                { key: 'id', label: 'Store ID', sortable: true },
                { key: 'name', label: 'Store name', sortable: true },
                { key: 'description', label: 'Description' },
                { key: 'image', label: 'Logo'},
                { key: 'actions', label: 'Actions'}
            ],
            logoProps: { width: 100, height: 50, class: 'm1' }
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
        save() {
            const method = this.store.id ? 'put' : 'post'
            const id = this.store.id ? `/${this.store.id}` : ''
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
