<template>
<v-card
        >
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
            
            <input id="user-id" type="hidden" v-model="user.id">
            <v-container>
            <v-layout row>
            <v-flex xs-12>
            <v-text-field
                v-model="user.data.password"
                :append-icon="showP ? 'visibility' : 'visibility_off'"
                :rules="passwordRules"
                :type="showP ? 'text' : 'password'"
                hint="At least 8 characters"
                @click:append="showP = !showP"
            ></v-text-field>
            </v-flex>
            <v-flex xs-12>
            <v-text-field
                ref="password"
                v-model="user.data.confirmPassword"
                :append-icon="showC ? 'visibility' : 'visibility_off'"
                :rules="confirmPasswordRules"
                :type="showC ? 'text' : 'password'"
                hint="At least 8 characters"
                @click:append="showC = !showC"
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
<v-btn
            :disabled="!valid"
            color="success"
            @click="save"
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
    name: 'UserStep3',
    computed: 
        mapState({
            user: state => state.user
        }),
    data() {
        return {
            valid: false,
            showP: false,
            showC: false,
            passwordRules: [
                v => !!v || 'Password is required',
                v => (v && v.length >= 8) || 'Password must have at least 8 characters'
            ],
            confirmPasswordRules: [
                (v) => !!v || 'Confirmation password is required'
            ]
        }
    },
    methods: {
        async save () {
            this.$store.dispatch('save', this.$router)
            
        },
        nextStep () {
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
