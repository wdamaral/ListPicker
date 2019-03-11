<template>
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
            </v-container>
</v-form>
<v-card-actions>
<v-btn
            :disabled="!valid"
            color="success"
            @click="validate"
        >Continue</v-btn>
  
          <v-btn flat
          
            @click="reset"
          >Cancel</v-btn>
</v-card-actions>
          </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'UserStep1',
    computed: 
        mapState({
            user: state => state.user
        }),
    data() {
        return {
            valid: false,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 50) || 'Name must be less than 50 characters'
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            phoneRules: [
                v => !!v || 'Phone number is required'
            ]
        }
    },
    methods: {
        nextStep() {
            this.$store.commit('nextStep')
        },
        validate () {
            if (this.$refs.form.validate()) {
                this.$store.commit('nextStep')
            }
        },
        reset () {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.$store.commit('resetStep')
        }
    }, 
    

}
</script>

<style>

</style>
