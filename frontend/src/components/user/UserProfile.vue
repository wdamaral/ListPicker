<template>
    <div class="user-profile">
        <PageTitle icon="perm_identity" main="perm_identity"
            sub="User profile" />
        
        <v-container>
            <v-layout row justify-space-between wrap pa-3>
                <v-flex xs12 md8 offset-md2>
                    <v-card class="card--flex-toolbar">
            <v-toolbar card prominent class="green lighten-4">
                <v-avatar
                    size="100"
                    color="grey lighten-4"
                >
                    <img :src="require('../../assets/avatar_profile.png')" alt="avatar">
                </v-avatar>
                <p class="display-1 pl-4">Hi, I'm {{user.data.firstName}}</p>
                <v-spacer/>
                <p class="body-2 font-weight-light">Joined in {{user.data.createdAt | moment("MMMM, YYYY")}}</p>
            </v-toolbar>

            <v-card-text>
                <v-container fluid>
                    
                <p class="pt-4"><v-icon large>format_quote</v-icon></p>
                <p class="pl-4 body-1">This is just me.</p>
                <p class="pb-4"><v-icon large>format_quote</v-icon></p>
                <p class="body-2 font-weight-light"><v-icon small>local_grocery_store</v-icon> Last list fulfilled: {{deliveredAt}}</p>
                <p class="body-2 font-weight-light"><v-icon small>time_to_leave</v-icon> Last delivery made: {{deliveredAt}}</p>
                <p class="body-2 font-weight-light"><v-icon small>assignment_turned_in</v-icon> Last list picked: {{deliveredAt}}</p>
                <v-layout row wrap pa-3>
                    <v-flex xs12>
                        <p class="body-2 font-weight-light"><v-icon small>house</v-icon> Lives in {{user.data.city}}</p>
                        <v-divider></v-divider>
                    </v-flex>
                </v-layout>
                <v-layout row wrap pa-3>
                    <v-flex xs12>
                        <p class="text-xs-center" ><Map v-bind:latitude="user.data.latitude" v-bind:longitude="user.data.longitude"/></p>
                    </v-flex>
                </v-layout>
                </v-container>
            </v-card-text>
          </v-card>
                </v-flex>
                
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle'
import Map from '@/components/template/Map'
import {mapState} from 'vuex'
export default {
    name: 'UserProfile',
    components: { PageTitle, Map },
    computed: {
       ...mapState({user: state => state.user}) 
    },
    mounted() {
        this.$store.dispatch('user/getUser', this.$route.params.id)
    }, 
}
</script>

<style>

</style>
