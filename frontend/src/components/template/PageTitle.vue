<template>
    <div class="admin-pages">
        <h4 class="display-1"> 
            <v-icon large class="black--text" 
                v-if="icon">{{ main }} </v-icon> {{ sub }}
        </h4>
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
.admin-pages {
    margin-left: 50px;
    margin-right: 50px;
    margin-top: 20px
}
</style>
