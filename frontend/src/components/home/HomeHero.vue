<template>
  <div>
    <v-parallax :src="image" height="600">
      <v-layout align-center column justify-center>
        <v-btn
          @click="$vuetify.goTo('#easy', options)"
          color="red accent-4"
          dark
          large
          round
        >Grocery Shopping made easy</v-btn>
      </v-layout>
    </v-parallax>
  </div>
</template>

<script>
import * as easings from "vuetify/es5/util/easing-patterns";

export default {
  name: "HomeHero",
  data() {
    return {
      duration: 300,
      offset: 0,
      easing: "easeInOutCubic",
      easings: Object.keys(easings)
    };
  },
  computed: {
    image() {
      return require("../../assets/home/alone-basket-carrots.jpg");
    },
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      };
    }
  },
  methods: {
    madeEasy: () => {}
  }
};
</script>

<style>
</style>
