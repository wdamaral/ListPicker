<template>
    <div class="user-profile">
        <PageTitle icon="perm_identity" main="perm_identity"
            sub="User profile" />
        
        <v-container>
            <v-layout row justify-space-between wrap pa-3>
                <v-flex>
                    <v-card class="card--flex-toolbar">
            <v-toolbar card prominent class="green lighten-4">
                <v-avatar
                    size="100"
                    color="grey lighten-4"
                >
                    <img :src="require('../../assets/avatar_profile.png')" alt="avatar">
                </v-avatar>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>edit</v-icon>
              </v-btn>
  
              <v-btn icon>
                <v-icon>save</v-icon>
              </v-btn>
  
              <v-btn icon>
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
  
            <v-card-text>
                <v-layout row wrap pa-3>

                <v-flex xs12 sm6 pr-sm-3>
                <v-text-field
                    label="First name"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 pl-sm-3>
                <v-text-field
                    label="Last name"
                ></v-text-field>
                </v-flex>
                </v-layout>
                
                <v-layout row wrap pa-3>

                <v-flex xs12 sm6 pr-sm-3>
                <v-text-field
                    label="E-mail"
                    append-icon="email"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 pl-sm-3>
                <v-text-field
                    label="Phone number"
                    append-icon="phone"
                ></v-text-field>
                </v-flex>
                </v-layout>
                <v-layout row wrap pa-3>

                <v-flex xs12 sm6 pr-sm-3>
                <v-text-field
                    label="Password"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 pl-sm-3>
                <v-text-field
                    label="Confirm password"
                ></v-text-field>
                </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap pa-3>

                <v-flex xs12 sm6 pr-sm-3>
                <v-text-field
                    label="Street"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 pl-sm-3>
                <v-text-field
                    label="Unit #"
                ></v-text-field>
                </v-flex>
                </v-layout>
                <v-layout row wrap pa-3>

                <v-flex xs12 sm4 pr-sm-3>
                <v-text-field
                    label="City"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pl-sm-3>
                <v-text-field
                    label="Province"
                ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 pl-sm-3>
                <v-text-field
                    label="Postal code"
                ></v-text-field>
                </v-flex>
                </v-layout>
                
                <v-divider></v-divider>
            </v-card-text>
          </v-card>
                </v-flex>
                
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle'
export default {
    name: 'UserProfile',
    components: { PageTitle },
    

}
</script>

<style>

</style>
