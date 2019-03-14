<template>
    <v-navigation-drawer 
        v-model="drawer" 
        class="grey lighten-4" 
        light 
        disable-resize-watcher
        app
        clipped
        >
        <v-list>
            <template v-for="(item, index) in items">
                <v-list-tile :key="index">
                    <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
                    <v-list-tile-content>
                        {{item.title}}
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider :key="`divider-${index}`"></v-divider>
            </template>
        </v-list>
    </v-navigation-drawer>
    
</template>

<script>

export default {
    name: 'Menu',
    data() {
        return {
            drawer: true,
            items: [
            { title: 'Dashboard', icon: 'dashboard', link: 'admin/' },
            { title: 'Account', icon: 'account_box', link: '/admin/stores' },
            { title: 'Admin', icon: 'gavel', link: '/admin/dashboard' }
        ]}
    }
}
</script>

<style>
</style>
