<template>
  <v-app>
    <app-navigation/>
        <v-content transition="slide-x-transition">
            <router-view></router-view>
        </v-content>
        <v-snackbar
          v-model="appState.snackbar"
          bottom
          :timeout="appState.timeout"
        >
          {{ appState.snackText }}
          <v-btn
            color="pink"
            flat
            @click="appState.snackbar = false"
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
  computed: 
    mapState({
        appState: state => state
    }),
}
</script>
<style>
</style>
