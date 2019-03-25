<template>
  <v-app>
    <app-navigation/>
        <v-content transition="slide-x-transition">
            <router-view></router-view>
        </v-content>
        <v-snackbar
          v-model="snackbar"
          bottom
          :timeout="timeout"
        >
          {{ snackText }}
          <v-btn
            color="pink"
            flat
            @click="hideSnackbar"
          >
            Close
          </v-btn>
      </v-snackbar>
    </v-app>
</template>

<script>
import AppNavigation from '@/components/template/AppNavigation';

import { mapState } from 'vuex'
export default {
  name: 'App',
  components: { AppNavigation },
  computed: {
    ...mapState({
      user: state => state.user,
      snackbar: state => state.snackbar,
      snackText: state => state.snackText,
      timeout: state => state.timeout
    }),
  },
  methods: {
    hideSnackbar() {
      this.$store.commit('hideSnackbar')
    }
  },
}
</script>
<style>
</style>
