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
                label="Password"
                class="mr-3"
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
                label="Confirm password"
                class="ml-3"
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
            
            <v-flex>
                <p class="text-xs-center">
                    <v-avatar
                    size="80"
                    color="grey lighten-4"
                >
                    <img v-if="getImageUrl !==''" :src="getImageUrl" alt="avatar">
                    <img v-if="getImageUrl ===''" :src="require('../../assets/avatar_profile.png')" alt="avatar">
                </v-avatar>
                </p>
            </v-flex>
            <v-flex xs-12>
                
                <v-text-field 
                    label="Select an image"
                    @click="pickFile" 
                    v-model="imageName" 
                    prepend-icon="attach_file">
                </v-text-field>
                <input
						type="file"
						style="display: none"
						ref="image"
						accept="image/jpeg, image/jpg image/png, image/gif"
                        @change="upload($event)"
					>
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
        <v-flex xs-6>
    <p class="text-xs-left">
    <v-btn
            icon
            flat
            @click="stepBack"
        >
        <v-icon>arrow_back_ios</v-icon>
    </v-btn>
    </p>
        </v-flex>
        <v-flex xs-6>
    <p class="text-xs-right">
    <v-btn 
            :disabled="!valid"
            color="success"
            @click="save"
        >Finish</v-btn>
    </p>
        </v-flex>
    </v-layout>
</v-container>
</v-card-actions>
          </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'UserStep3',
    computed: {
        ...mapState({
            user: state => state.user
        }),
        getImageUrl: function() {
            return this.$store.getters.getImageUrl
        }
        },
    data() {
        return {
            imageName: '',
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
        save () {
            this.$store.dispatch('save', this.$router)
        },
        stepBack() {
            this.$store.commit('stepBack')
        },
        pickFile () {
            this.$refs.image.click ()
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
        },
        upload(event) {
            this.$store.dispatch('upload', event)
        }
        
    }

}
</script>

<style>

</style>
