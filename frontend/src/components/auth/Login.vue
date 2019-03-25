<template>
  <v-layout fill-height align-center mx-3>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-img
          class="white--text"
          height="200px"
          :src="require('@/assets/home/pexels-photo-95425.jpeg')"
        >
        </v-img>
        <v-card-text class="pa-4 text-xs-center">
            
          <v-layout row pa-3>
            <v-flex  xs12>
              <v-text-field
                prepend-inner-icon="email"
                v-model="user.email"
                :rules="[rules.required]"
                label="E-mail"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row pa-3>
            <v-flex xs12>
              <v-text-field
                v-model="user.password"
                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                :rules="[rules.required]"
                :type="show1 ? 'text' : 'password'"
                prepend-inner-icon="security"
                label="Password"
                @click:append="show1 = !show1"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex class="text-xs-right" xs12>
                Forgot password?
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions class="text-xs-right">
          <v-btn flat  color="green" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { userKey } from '@/global'
import { mapState } from 'vuex';
export default {
  name: "Login",
  data() {
    return {
        user: {},
      show1: false,
      valid: false,
      rules: {
        required: value => !!value || "Required."
      }
    }
  },
  methods: {
      login() {
          console.log(this.$router)
          this.$store.dispatch('user/LOGIN', {
              payload: this.user, 
              router: this.$router})
      }
  }

};
</script>

<style>
.item {
  max-height: 300px;
  max-width: 300px;
}
</style>
