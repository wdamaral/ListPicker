<template>
    <v-navigation-drawer
      class="grey lighten-3"
      light
      clipped
      right
      :mini-variant.sync="mini"
      app
      width="200"
    >
      <v-list>
        <v-list-tile>
            <v-list-tile-action>
              <v-btn
                icon
                @click.stop="mini = !mini"
              >
                <v-icon v-if="mini">chevron_left</v-icon>
                <v-icon v-if="!mini">chevron_right</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          router
          :to="item.link"
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
</template>

<script>
export default {
    name: 'Menu',
    data () {
    return {
      mini: true,
      items: [
        { title: 'Dashboard', icon: 'dashboard', link: 'admin/' },
        { title: 'Account', icon: 'account_box', link: '/admin/stores' },
        { title: 'Admin', icon: 'gavel', link: '/admin/dashboard' }
      ]
      }
    }
}
</script>

<style>
</style>
