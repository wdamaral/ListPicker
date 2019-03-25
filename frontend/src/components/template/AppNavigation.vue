<template>
    <div>
        
    <v-toolbar app color="red" dark clipped-left clipped-right>
        <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
        <v-spacer class="hidden-md-and-up"></v-spacer>
        <img :src="require('../../assets/logo.png')" id="logo" class="hidden-sm-and-down" alt="Grocery List Picker">
        <v-toolbar-title>{{appTitle}}</v-toolbar-title>
        <img :src="require('../../assets/logo.png')" id="logo" class="hidden-md-and-up" alt="Grocery List Picker">
        <v-spacer class="hidden-sm-and-down"></v-spacer>
        <v-btn v-if="!user.data" flat class="hidden-sm-and-down" @click="login">SIGN IN</v-btn>
        <v-btn v-if="user.data" flat @click="logout" class="hidden-sm-and-down">LOGOUT</v-btn>
        <v-btn color="teal lighten-2" class="hidden-sm-and-down" @click="signup">JOIN</v-btn>
    </v-toolbar>
    <v-navigation-drawer
        v-model="drawer"
        :mini-variant="mini"
        absolute
        dark
        temporary
      >
        <v-list class="pa-1">
          <v-list-tile v-if="mini" @click.stop="mini = !mini">
            <v-list-tile-action>
              <v-icon>chevron_right</v-icon>
            </v-list-tile-action>
          </v-list-tile>
  
          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>
  
            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
            </v-list-tile-content>
  
            <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
  
        <v-list class="pt-0" dense>
          <v-divider light></v-divider>
  
          <v-list-tile
            v-for="item in items"
            :key="item.title"
            
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
  
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
     </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'AppNavigation',
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    data() {
        return {
            appTitle: 'Grocery List Picker',
            drawer: false,
            items: [
                { title: 'Home', icon: 'dashboard' },
                { title: 'About', icon: 'question_answer' }
            ],
            
            mini: false,
            right: null   
        };
    },
    methods: {
      logout() {
        this.$store.dispatch('user/LOGOUT',this.$router)

      },
      signup() {
        this.$router.push('/signin')
      },
      login() {
        this.$router.push('/login')
      }

    },

};
</script>


<style scoped>
#logo {
    transform: rotate(-5deg);
    -webkit-transform: rotate(-5deg);
    -moz-transform: rotate(-5deg);
    -ms-transform: rotate(-5deg);
    -o-transform: rotate(-5deg);
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
    max-height: 40px;
}
</style>