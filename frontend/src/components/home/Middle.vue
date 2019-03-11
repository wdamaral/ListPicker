<template>
   <section>
        <v-layout
          column
          wrap
          class="my-5"
          align-center
        >
          <v-flex xs12 sm4 class="my-3">
            <div class="text-xs-center">
              <h2 class="headline">Your grocery shopping made easy</h2>
              <span class="subheading">
                Now, you don't need to leave the comfort of your house anymore
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md3>
                  <v-card class="elevation-4 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="red--text text--lighten-2">assignment</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Grocery list</div>
                    </v-card-title>
                    <v-card-text>
                      Post it! Select the store you need the products from. Add the items, quantity, brand and post it. Then, 
                      just wait.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md3>
                  <v-card class="elevation-4 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="red--text text--lighten-2">local_grocery_store</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">Shopping</div>
                    </v-card-title>
                    <v-card-text>
                      A picker, will pick your list. He will go to the grocery store you selected, buy
                      all items you asked, and inform the prices he paid.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md3>
                  <v-card class="elevation-4 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="red--text text--lighten-2">time_to_leave</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Delivery</div>
                    </v-card-title>
                    <v-card-text>
                      The picker will let you know when he finished buying your grocery list. Soon, you will receive
                      all your items at the comfort of your house.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md3>
                  <v-card class="elevation-4 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="red--text text--lighten-2">attach_money</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Pay</div>
                    </v-card-title>
                    <v-card-text>
                      After you receive the items, you match the prices with the receipt. If everything is ok, you pay
                      through your online wallet.  
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>
</template>

<script>
export default {
    name: 'Middle'
}
</script>

<style>

</style>
