<template>
	<v-layout row justify-center>
		<v-dialog v-model="list.addItemModal" persistent max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Add New Grocery item</span>
				</v-card-title>
				<v-card-text>
					<v-form ref="form" lazy-validation v-model="valid">
						<v-container grid-list-md>
							<v-layout wrap>
								<v-flex xs12 sm6>
									<v-text-field
										label="Item name *"
										hint="Potatoes? Tomatoes? Meat?"
										v-model="list.editedItem.item"
										counter="30"
										maxlength="30"
										:rules="nameRules"
										required
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm3>
									<v-text-field
										type="number"
										label="Quantity *"
										v-model="list.editedItem.quantity"
										hint="How much do you want?"
										v-bind:rules="quantityRules"
										required
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm3>
									<v-select
										:items="['LB', 'KG', 'EA', 'CS']"
										label="Unit *"
										hint="Kilo? Pound? Case? Each?"
										v-model="list.editedItem.unit"
										v-bind:rules="unitRules"
										required
									></v-select>
								</v-flex>
								<v-flex xs12>
									<v-text-field
										label="Brand *"
										hint="What is your favourite?"
										v-model="list.editedItem.brand"
										required
										counter="30"
										maxlength="30"
										v-bind:rules="brandRules"
									></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-text-field
										label="Comments"
										hint="Any recommendations for the picker?"
										v-model="list.editedItem.comments"
										counter="60"
										maxlength="60"
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm6></v-flex>
							</v-layout>
						</v-container>
						<small class="red--text">* indicates required field</small>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click="closeModal">Close</v-btn>
					<v-btn color="blue darken-1" :disabled="!valid" flat @click="save">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	name: 'AddItemModal',
	data() {
		return {
			valid: true,
			nameRules: [v => !!v || 'Item name is required'],
			quantityRules: [v => !!v || 'Quantity is required'],
			unitRules: [v => !!v || 'Unit is required'],
			brandRules: [v => !!v || 'Brand is required'],
		};
	},
	computed: {
		...mapState({
			list: state => state.list,
		}),
		...mapGetters({
			getMode: 'list/GET_MODE',
			getEditedItem: 'list/GET_EDITED_ITEM',
		}),
	},
	methods: {
		closeModal() {
			this.$store.commit('list/SET_EDITED_ITEM', {});
			this.valid = true;
			this.$store.commit('list/SHOW_MODAL');
		},
		save() {
			if (this.$refs.form.validate()) {
				if (this.getMode === 'UPDATE') {
					this.$store.dispatch('list/SAVE_ITEM_DB');
					this.$store.commit('list/SHOW_MODAL');
				} else {
					this.$store.commit('list/ADD_ITEM', this.getEditedItem);
					this.$store.commit('list/SET_EDITED_ITEM', {});
					this.$refs.form.reset();
				}
				this.valid = true;
			}
		},
	},
};
</script>

<style>
</style>
