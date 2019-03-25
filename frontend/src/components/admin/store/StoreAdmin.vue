<template>
<div class="store-admin">
    <PageTitle icon="store" main="store"
            sub="Store administration" />
            <v-card
        >
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
            <v-container>
            <v-layout row>
            <v-flex xs-12>
                
            <v-text-field
                v-model="user.data.firstName"
                :counter="50"
                :rules="nameRules"
                label="First name"
                required
            ></v-text-field>
            </v-flex>
            <v-flex xs-12>
            <v-text-field
                v-model="user.data.lastName"
                :counter="50"
                :rules="nameRules"
                label="Last name"
                required
            ></v-text-field>
            </v-flex>
            </v-layout>
            <v-layout row>
            <v-flex xs-12>
            <v-text-field
                append-icon="email"
                
                v-model="user.data.email"
                :rules="emailRules"
                label="E-mail"
                required
            ></v-text-field>
            </v-flex>
            <v-flex xs-12>
            <v-text-field
                append-icon="phone"
                mask="phone"
                v-model="user.data.phoneNumber"
                :rules="phoneRules"
                label="Phone number"
                required
            ></v-text-field>
            </v-flex>
            </v-layout>
            <v-layout row>
            <v-flex xs-12>
            <v-icon small class="red--text">lock</v-icon> 
            <span class="caption red--text">Don't worry, we won't share any information.</span>
            </v-flex>
            </v-layout>
            </v-container>
</v-form>
<v-divider></v-divider>
<v-card-actions>
    <v-container fluid>
    <v-layout row >
    
    <v-flex xs-12>
        <p class="text-xs-right">
            <v-btn 
                :disabled="!valid"
                color="success"
                @click="validate"
            >Next</v-btn>
        </p>
        </v-flex>
    </v-layout>
</v-container>
</v-card-actions>
          </v-card>
    <v-container>
    <v-data-table
      :headers="headers"
      :items="listOfStores.stores"
      :pagination.sync="pagination"
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:headers="props">
        <tr>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <tr :active="props.selected" @click="props.selected = !props.selected">
          <td>1</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="justify-center">{{ props.item.description }}</td>
          <td class="justify-center"><img v-bind="logoProps" :src="props.item.imageUrl" rounded thumbnail fluid/></td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    </v-container>
</div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle'
export default {
    name: 'StoreAdmin',
    components: { PageTitle },
    data: () => ({
        valid: false,
        pagination: {
            sortBy: 'name',
        },
        headers: [
            { text: 'Id', value: 'id' },
            {
                text: 'Store name',
                align: 'left',
                value: 'name'
            },
            { text: 'Description', value: 'description' },
            { text: 'Logo', value: 'logo', sortable: false },
            { text: 'Actions', value: 'actions', sortable: false }
        ],
            logoProps: { width: 60, height: 30, class: 'm1' }
  }),

    methods: {
        
        changeSort (column) {
        if (this.pagination.sortBy === column) {
            this.pagination.descending = !this.pagination.descending
        } else {
            this.pagination.sortBy = column
            this.pagination.descending = false
        }
        },
        loadStores() {
            this.$store.dispatch('store/GET_STORES')
        },
    },
    mounted() {
        this.loadStores()
    },
    computed: {
        listOfStores() {
            return this.$store.getters['store/GET_STORES']
        }
    },
}
</script>

<style>

</style>
