<template>
    <v-template>
        <Menu/>
        <PageTitle main="dashboard" sub="Dashboard" icon="true"/>
        <router-view></router-view>
    
    </v-template>
</template>

<script>
import Menu from './Menu'
import PageTitle from './PageTitle'
export default {
    name: 'Admin',
    components: { Menu, PageTitle }

}
</script>

<style>

</style>
