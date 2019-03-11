<template>
    <section>
        <v-parallax :src="require('../../assets/home/pexels-photo-95425.jpeg')" height="380">
          <v-layout column align-center justify-center>
            <div class="headline white--text mb-3 text-xs-center">Sign-up today and enjoy!</div>
            <v-btn
              class="red lighten-2 mt-5"
              dark
              large
            >
              Get Started
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>
</template>

<script>
export default {
    name: 'Bottom'

}
</script>

<style>

</style>
