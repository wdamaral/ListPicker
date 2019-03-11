<template>
    <v-container>
            <v-stepper v-model="user.step">
                <v-stepper-header>
                    <v-stepper-step :complete="user.step > 1" step="1">
                        Your information
                    </v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step :complete="user.step > 2" step="2">
                        Your location
                    </v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step :complete="user.step > 3" step="3">
                        Your information
                    </v-stepper-step>
                    <v-divider></v-divider>
                </v-stepper-header>
            <v-stepper-items>
        <v-stepper-content step="1">
            <UserStep1/>
        </v-stepper-content>
  
        <v-stepper-content step="2">
          <UserStep2/>
        </v-stepper-content>
  
        <v-stepper-content step="3">
          <UserStep3/>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-snackbar
        v-model="user.snackbar"
        bottom
        :timeout="user.timeout"
      >
        {{ user.text }}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-container>
    
</template>

<script>
import {mapState} from 'vuex'
import UserStep1 from './UserStep1'
import UserStep2 from './UserStep2'
import UserStep3 from './UserStep3'
export default {
    name: 'SignIn',
    components: {
        UserStep1,
        UserStep2,
        UserStep3,
    },
    computed: 
        mapState({
            user: state => state.user
        })
}
</script>

<style>

</style>
