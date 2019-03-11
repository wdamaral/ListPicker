<template>
  <v-app>
    <app-navigation/>
        <v-content transition="slide-x-transition">
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
import AppNavigation from '@/components/template/AppNavigation';

import { mapState } from 'vuex'
export default {
  name: 'App',
  components: { AppNavigation }
}
</script>
<style>
</style>
