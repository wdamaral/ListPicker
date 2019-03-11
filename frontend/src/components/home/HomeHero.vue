<template>
<div>
    <v-parallax
      :src="image"
      height="600"
      >
      <v-layout
        align-center
        column
        justify-center
      >
        <v-btn color="red accent-4" dark large round>Grocery Shopping made easy</v-btn>
        
      </v-layout>
    </v-parallax>
</div>
</template>

<script>
export default {
    name: 'HomeHero',
    computed: {
        image() {
            return require('../../assets/home/alone-basket-carrots.jpg')
        }
    },
}
</script>

<style>
</style>
