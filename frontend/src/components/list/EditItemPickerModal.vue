<template>
	<v-layout row justify-center>
		<v-dialog v-model="list.addItemModal" lazy persistent max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Add New Grocery item</span>
				</v-card-title>
				<v-card-text>
					<v-form ref="form" lazy-validation v-model="valid">
						<v-container grid-list-md>
							<input type="hidden" v-bind:value="list.editedItem.id">
							<v-layout wrap>
								<v-flex xs12 sm6>
									<v-text-field label="Item name" disabled v-bind:value="list.editedItem.item" required></v-text-field>
								</v-flex>
								<v-flex xs12 sm3>
									<v-text-field
										disabled
										type="number"
										label="Quantity"
										required
										v-bind:value="list.editedItem.quantity"
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm3>
									<v-select
										disabled
										:items="['LB', 'KG', 'EA', 'CS']"
										label="Unit *"
										required
										v-bind:value="list.editedItem.unit"
									></v-select>
								</v-flex>
								<v-flex xs12>
									<v-text-field
										disabled
										label="Brand *"
										hint="What is your favourite?"
										required
										v-bind:value="list.editedItem.brand"
									></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-text-field
										label="Comments"
										hint="Any recommendations for the picker?"
										v-bind:value="list.editedItem.comments"
										disabled
									></v-text-field>
								</v-flex>
							</v-layout>
							<v-divider/>
							<v-layout row wrap py-3>
								<v-flex xs12 sm6>
									<v-text-field
										label="Qty bought *"
										hint="How much did you buy? Put 0 if you did not buy"
										type="number"
										v-model="list.editedItem.qtyBought"
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm6>
									<v-text-field
										label="Price paid *"
										hint="How much did you pay? Put 0 if you did not buy"
										type="number"
										prefix="$"
										v-model="list.editedItem.cost"
									></v-text-field>
								</v-flex>
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
import { mapState } from 'vuex';
export default {
	name: 'EditItemPickerModal',
	data() {
		return {
			editedItem: {},
			valid: true,
		};
	},
	computed: {
		...mapState({
			list: state => state.list,
		}),
	},
	methods: {
		closeModal() {
			this.editedItem = {};
			this.$store.commit('list/SET_EDITED_ITEM', {});
			this.$store.commit('list/SHOW_MODAL');
		},
		save() {
			this.$store.dispatch('list/PICKER_UPDATE_LIST');
			this.$store.commit('list/SET_EDITED_ITEM', {});
			this.$store.commit('list/SHOW_MODAL');
			this.$refs.form.reset();
		},
	},
};
</script>

<style>
</style>
