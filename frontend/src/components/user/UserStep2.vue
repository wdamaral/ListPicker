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
                v-model="user.data.street"
                append-icon="home"
                :counter="100"
                :rules="streetRules"
                label="Street"
                required
            ></v-text-field>
            </v-flex>
            <v-flex xs-12>
            <v-text-field
                v-model="user.data.unit"
                :counter="10"
                label="Unit #"
            ></v-text-field>
            </v-flex>
            </v-layout>
            <v-layout row>
            <v-flex xs-12>
            <v-text-field
                v-model="user.data.city"
                :counter="50"
                :rules="cityRules"
                label="City"
                required
            ></v-text-field>
            </v-flex>
            <v-flex xs-12>
            <v-text-field
                v-model="user.data.province"
                :rules="provinceRules"
                label="Province"
                mask="AA"
                required
            ></v-text-field>
            </v-flex>
            <v-flex xs-12>
            <v-text-field
                v-model="user.data.postalCode"
                :rules="postalRules"
                label="Postal Code"
                mask="A#A #A#"
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
            @click="validate"
        >Next</v-btn>
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
    name: 'UserStep1',
    computed: {
        ...mapState({
            user: state => state.user
        })
    },
    data() {
        return {
            valid: false,
            streetRules: [
                v => !!v || 'Street is required',
                v => (v && v.length <= 100) || 'Street must be less than 100 characters'
            ],
            cityRules: [
                v => !!v || 'City is required',
                v => (v && v.length <= 100) || 'City must be less than 50 characters'
            ],
            provinceRules: [
                v => !!v || 'Province is required',
                v => (v && v.length <= 2) || 'Province with only 2 characters'
            ],
            postalRules: [
                v => !!v || 'Postal code is required',
                v => /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(v)
            ]
        }
    },
    methods: {
        nextStep() {
            this.$store.commit('user/nextStep')
        },
        stepBack() {
            this.$store.commit('user/stepBack')
        },
        validate () {
            if (this.$refs.form.validate()) {
                this.$store.commit('user/nextStep')
            }
        },
        reset () {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.$store.commit('user/resetStep')
        }
    }, 
    

}
</script>

<style>

</style>
