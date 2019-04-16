<template>
	<div class="new-list">
		<v-container pa-0 pt-4 my-0>
			<v-form v-model="valid">
				<v-layout row justify-space-between wrap pa-3>
					<v-flex>
						<v-card class="card--flex-toolbar">
							<v-toolbar card prominent class="green lighten-4 elevation-1">
								<v-avatar v-if="list.list.owner.profilePicture" class="elevation-3" size="100">
									<v-img :src="`${pictureApiUrl}${list.list.owner.profilePicture}`"/>
								</v-avatar>
								<v-avatar v-else class="green lighten-2 elevation-3" size="100">
									<v-icon size="60" dark>account_circle</v-icon>
								</v-avatar>

								<p class="headline pl-4 elevation">{{list.list.owner.firstName}}'s list</p>
							</v-toolbar>
							<v-card-text>
								<v-layout align-center pt-4 row>
									<v-flex xs12>
										<h4 class="display-1 py-2">Status</h4>
										<v-divider class="pb-2"/>
										<p class="body-2">Created on {{ list.list.createdAt | moment }}</p>
										<p v-if="list.list.updatedAt" class="body-2">Updated on {{ list.list.updatedAt | moment }}</p>
										<p class="body-2">Picked? {{ list.list.picker ? 'Yes' : 'Not yet.' }}</p>
										<p
											v-if="list.list.picker"
											class="body-2"
										>Who picked the list? {{ list.list.picker.firstName }}</p>
										<p v-if="list.list.picker" class="body-2">When? {{ list.list.pickedAt | moment }}</p>
										<p
											v-if="list.list.deliveredAt"
											class="body-2"
										>Delivered? {{ list.list.deliveredAt ? 'Yes' : 'No' }}</p>
										<p v-if="list.list.confirmedAt" class="body-2">When? {{ list.list.deliveredAt | moment }}</p>
										<p
											v-if="list.list.confirmedAt"
											class="body-2"
										>Confirmed? {{ list.list.confirmedAt ? 'Yes' : 'No' }}</p>
										<p v-if="list.list.confirmedAt" class="body-2">When? {{ list.list.confirmedAt | moment }}</p>
										<v-divider class="pb-2"/>
									</v-flex>
								</v-layout>
								<v-layout align-center pa-4 row>
									<v-flex xs6>
										<v-select
											:items="store.stores.stores"
											item-text="name"
											item-value="id"
											label="Store"
											v-model="list.list.storeId"
											:rules="selectionRules"
											required
										></v-select>
									</v-flex>
									<v-flex xs6>
										<v-img max-width="150" max-height="50" :src="getSelectedStore(list.list.storeId)"></v-img>
									</v-flex>
								</v-layout>
								<v-divider/>
								<v-layout align-center row>
									<v-flex xs12>
										<v-toolbar flat color="white">
											<v-toolbar-title>List of items</v-toolbar-title>
											<v-spacer></v-spacer>
											<template>
												<v-btn icon class="mb-2 light-green" @click="activateModal">
													<v-icon>add</v-icon>
												</v-btn>
											</template>
										</v-toolbar>
										<v-divider class="pb-4"/>
										<AddItemModal v-model="list.showModal"/>
										<v-layout v-resize="onResize" column>
											<v-data-table
												:headers="headers"
												:items="list.list.listItems"
												class="elevation-1"
												item-key="id"
												:hide-headers="isMobile"
												:class="{mobile: isMobile}"
											>
												<template v-slot:items="props">
													<tr v-if="!isMobile">
														<td @click="props.expanded = !props.expanded" class="text-xs-left">{{ props.item.id }}</td>
														<td class="text-xs-left">{{ props.item.item }}</td>
														<td class="text-xs-right">{{ props.item.quantity }}</td>
														<td class="text-xs-right">{{ props.item.unit }}</td>
														<td class="text-xs-right">{{ props.item.brand }}</td>
														<td class="text-xs-right">
															<v-icon small class="red--text" @click="deleteItem(props.item)">delete</v-icon>
														</td>
													</tr>
													<tr v-else>
														<td>
															<ul class="flex-content">
																<li class="flex-item text-xs-left" data-label="#">{{ props.item.id }}</li>
																<li class="flex-item text-xs-left" data-label="Item">{{ props.item.item }}</li>

																<li class="flex-item text-xs-left" data-label="Qty.">{{ props.item.quantity }}</li>
																<li class="flex-item text-xs-left" data-label="Unit">{{ props.item.unit }}</li>
																<li class="flex-item text-xs-left" data-label="Brand">{{ props.item.brand }}</li>
																<li class="flex-item text-xs-left" data-label="Action">
																	<v-icon small class="red--text" @click="deleteItem(props.item)">delete</v-icon>
																</li>
																<li
																	class="flex-item comment text-xs-left"
																	data-label="Comments"
																>{{ props.item.comments }}</li>
															</ul>
														</td>
													</tr>
												</template>
												<template v-slot:expand="props">
													<v-card flat>
														<v-card-text>{{ props.item.comments }}</v-card-text>
													</v-card>
												</template>
											</v-data-table>
										</v-layout>
									</v-flex>
								</v-layout>

								<v-layout row wrap py-4>
									<v-flex>
										<h4 class="display-1 py-2">Location to deliver</h4>
										<v-divider class="pb-4"/>
										<Map
											v-bind:latitude="list.list.owner.latitude"
											v-bind:longitude="list.list.owner.longitude"
										/>
									</v-flex>
								</v-layout>
							</v-card-text>
							<v-card-actions>
								<v-layout row>
									<v-flex xs12 text-xs-right>
										<v-btn :disabled="!valid" color="success" @click="save" class="flex ma-1" round>
											<v-icon>save</v-icon>Save
										</v-btn>
										<v-btn color="red" dark @click="removeList" class="flex ma-1" round>
											<v-icon>mdi-delete</v-icon>Remove
										</v-btn>
									</v-flex>
								</v-layout>
							</v-card-actions>
						</v-card>
					</v-flex>
				</v-layout>
			</v-form>
		</v-container>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { baseProfilePicUrl, baseStoreImgUrl } from '@/global';
import AddItemModal from './AddItemModal';
import Map from '@/components/template/Map';
import moment from 'moment';
export default {
	name: 'NewList',
	components: { AddItemModal, Map },
	data() {
		return {
			isMobile: false,
			stores: [],
			valid: false,
			edit: false,
			expand: false,
			dialog: false,
			pictureApiUrl: baseProfilePicUrl,
			headers: [
				{
					text: '#',
					align: 'left',
					sortable: false,
					value: 'id',
				},
				{
					text: 'Item name',
					align: 'left',
					value: 'item',
				},
				{ text: 'Quantity', value: 'quantity', align: 'right' },
				{ text: 'Unit', value: 'unit', align: 'right' },
				{ text: 'Brand', value: 'brand', align: 'right' },
				{
					text: 'Actions',
					value: 'id',
					sortable: false,
					align: 'right',
				},
			],
			selectionRules: [v => !!v || 'Store is required.'],
		};
	},
	filters: {
		moment: date => {
			if (date) return moment(date).format('MMMM Do, YYYY');

			return 'Nothing yet.';
		},
	},
	computed: {
		...mapState({
			list: state => state.list,
			store: state => state.store,
		}),
		...mapGetters({
			getMode: 'list/GET_MODE',
			getStores: 'store/GET_STORES',
			getStoreImage: 'store/GET_SELECTED_STORE_IMAGE',
			getItemsSize: 'list/GET_ITEMS_LENGTH',
		}),
	},

	methods: {
		onResize() {
			if (window.innerWidth < 769) this.isMobile = true;
			else this.isMobile = false;
		},
		getSelectedStore(id) {
			if (id) {
				return baseStoreImgUrl + this.getStoreImage(id);
			}
		},
		save() {
			if (this.getItemsSize > 0) {
				this.$store.dispatch('list/UPDATE', this.$router);
			} else {
				this.$store.commit(
					'activeSnackbar',
					'Please, add items to your list.',
					{
						root: true,
					}
				);
			}
		},
		activateModal() {
			this.$store.commit('list/SHOW_MODAL');
		},
		deleteItem(item) {
			if (this.getItemsSize > 1) {
				confirm('Are you sure you want to delete this item?') &&
					this.$store.dispatch('list/DELETE_ITEM_DB', item.id);
			} else {
				confirm('Your list will be removed. Ok?') &&
					this.$store.dispatch('list/REMOVE_LIST', this.$router);
			}
		},
		removeList() {
			confirm('Your list will be removed. Ok?') &&
				this.$store.dispatch('list/REMOVE_LIST', this.$router);
		},
	},
	async mounted() {
		await this.$store.dispatch('store/GET_STORES');
		await this.$store.dispatch('list/GET_LIST', this.$route.params.id);
		this.$store.commit('list/SET_MODE', 'UPDATE');
		this.$store.commit('list/SET_SELECTED_LIST', this.$route.params.id);
	},
};
</script>

<style>
.mobile {
	color: #333;
}

@media screen and (max-width: 768px) {
	.mobile table.v-table tr {
		max-width: 100%;
		position: relative;
		display: block;
	}

	.mobile table.v-table tr:nth-child(odd) {
		border-left: 6px solid deeppink;
	}

	.mobile table.v-table tr:nth-child(even) {
		border-left: 6px solid cyan;
	}

	.mobile table.v-table tr td {
		display: flex;
		width: 100%;
		border-bottom: 1px solid #f5f5f5;
		height: auto;
		padding: 10px;
	}

	.mobile table.v-table tr td ul li:before {
		content: attr(data-label);
		padding-right: 0.5em;
		text-align: left;
		display: block;
		color: #999;
	}
	.v-datatable__actions__select {
		width: 50%;
		margin: 0px;
		justify-content: flex-start;
	}
	.mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
		background: transparent;
	}
}
.flex-content {
	padding: 0;
	margin: 0;
	list-style: none;
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}

.flex-item {
	padding: 5px;
	width: 50%;
	height: 40px;
	font-weight: bold;
}
.flex-content .comment {
	padding: 5px;
	width: 100%;
	height: 60px;
	font-weight: bold;
}
</style>
