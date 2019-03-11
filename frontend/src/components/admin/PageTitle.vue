<template>
    <div class="page-title">
        <h3 class="display-2"> <v-icon large class="black--text" v-if="icon" :class="icon">{{ main }} </v-icon> {{ sub }}</h3>
        <hr>
    </div>
</template>

<script>
export default {
    name: 'PageTitle',
    props: ['icon', 'main', 'sub']
}
</script>

<style>
</style>
