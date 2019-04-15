<template>
	<div class="new-list">
		<EditItemPickerModal v-model="list.addItemModal"/>
		<v-container pa-0 pt-4 my-0>
			<v-form v-model="valid">
				<v-layout row justify-space-between wrap pa-3>
					<v-flex>
						<v-card class="card--flex-toolbar">
							<v-toolbar card prominent class="green lighten-4 elevation-1">
								<v-avatar
									v-if="list.list.owner && list.list.owner.profilePicture"
									class="elevation-3"
									size="100"
								>
									<v-img :src="`${pictureApiUrl}${list.list.owner.profilePicture}`"/>
								</v-avatar>
								<v-avatar v-else class="green lighten-2 elevation-3" size="100">
									<v-icon size="60" dark>account_circle</v-icon>
								</v-avatar>
								<v-layout justify-space-between>
									<p
										v-if="list.list.owner"
										class="headline pl-4 elevation"
									>{{list.list.owner.firstName}}'s list</p>
									<v-icon
										v-if="list.list.ownerId === user.auth.id && !list.list.pickedAt"
										icon
										flat
										@click="editList"
									>mdi-file-document-edit</v-icon>
								</v-layout>
							</v-toolbar>
							<v-card-text>
								<v-layout row justify-space-between>
									<v-flex xs3>
										<h4 class="display-1 py-3">Status</h4>
									</v-flex>
									<v-flex v-if="list.list.isConfirmed" xs3 md1 text-xs-right align-self-center>
										<v-img
											max-width="150px"
											alt="List delivered and paid."
											:src="require('@/assets/list_paid.png')"
										/>
									</v-flex>
								</v-layout>
								<v-divider class="pb-2"/>
								<v-layout align-center wrap pt-2 row>
									<v-flex xs12 md6 grow>
										<p class="body-2">
											<v-icon small>mdi-calendar</v-icon>
											Created on {{ list.list.createdAt | moment }}
										</p>
										<p v-if="list.list.updatedAt" class="caption">
											<v-icon small>mdi-calendar</v-icon>
											Updated on {{ list.list.updatedAt | moment }}
										</p>
										<p class="caption">
											<v-icon>mdi-hand-okay</v-icon>
											Picked? {{ list.list.picker ? 'Yes' : 'Not yet.' }}
										</p>
										<p v-if="list.list.picker" class="caption">
											<v-icon small>mdi-account</v-icon>
											Who picked the list? {{ list.list.picker.firstName }}
										</p>
										<p v-if="list.list.picker" class="caption">
											<v-icon small>mdi-calendar</v-icon>
											When? {{ list.list.pickedAt | moment }}
										</p>
										<p v-if="list.list.deliveredAt" class="caption">
											<v-icon small>mdi-truck-delivery</v-icon>
											Delivered? {{ list.list.deliveredAt ? 'Yes' : 'No' }}
										</p>
										<p v-if="list.list.confirmedAt" class="caption">
											<v-icon small>mdi-calendar</v-icon>
											When? {{ list.list.deliveredAt | moment }}
										</p>
										<p v-if="list.list.confirmedAt" class="caption">
											<v-icon small>mdi-credit-card</v-icon>
											Confirmed? {{ list.list.confirmedAt ? 'Yes' : 'No' }}
										</p>
										<p v-if="list.list.confirmedAt" class="caption">
											<v-icon small>mdi-calendar</v-icon>
											When? {{ list.list.confirmedAt | moment }}
										</p>
									</v-flex>
									<v-flex
										xs12
										md6
										v-if="!list.list.isBought || !list.list.isDelivered || !list.list.isConfirmed"
									>
										<v-layout row align-center wrap>
											<v-flex xs12>
												<v-text-field
													v-if="(!list.list.receiptNumber || !list.list.isBought) && 
																	(user.auth.id === list.list.pickerId)"
													v-model="list.list.receiptNumber"
													:append-outer-icon="list.list.receiptNumber ? 'mdi-content-save' : 'undefined'"
													solo
													label="Receipt number"
													type="text"
													hint="The number must match the hard copy"
													@click:append-outer="saveReceipt"
													required
													:disabled="list.list.isBought"
													:rules="receiptRules"
													validate-on-blur
													color="green"
												></v-text-field>
												<p v-else class="subheading">
													<v-icon v-if="list.list.isBought">mdi-receipt</v-icon>
													{{ list.list.receiptNumber }}
												</p>
											</v-flex>
											<v-flex v-if="list.list.pickerId === user.auth.id" xs12>
												<v-switch
													v-model="list.list.isBought"
													v-on:change="setBoughtTime"
													:disabled="list.list.isBought"
													color="green lighten-2"
													label="Mark as bought"
												></v-switch>
											</v-flex>
											<v-flex
												v-if="list.list.pickerId === user.auth.id && list.list.isBought"
												xs12
												text-xs-center
											>
												<v-switch
													v-model="list.list.isDelivered"
													v-on:change="setDeliveredTime"
													:disabled="list.list.isDelivered"
													color="green lighten-2"
													label="Mark as delivered"
												></v-switch>
											</v-flex>
											<v-flex
												v-if="list.list.ownerId === user.auth.id && list.list.isDelivered"
												xs12
												text-xs-center
											>
												<v-switch
													v-model="list.list.isConfirmed"
													v-on:change="setConfirmedTime"
													:disabled="list.list.isConfirmed"
													color="green lighten-2"
													label="Confirm delivery"
												></v-switch>
											</v-flex>
										</v-layout>
									</v-flex>
								</v-layout>

								<v-layout align-center pt-4 row>
									<v-flex xs12 pb-3>
										<h4 class="display-1 py-2">Where to go</h4>
										<v-divider class="pb-2"/>
										<v-img max-width="300" max-height="100" :src="getSelectedStore(list.list.storeId)"></v-img>
									</v-flex>
								</v-layout>
								<v-layout align-center row>
									<v-flex xs12>
										<v-toolbar flat color="white">
											<v-toolbar-title>List of items</v-toolbar-title>
											<v-spacer/>
											<v-flex
												xs8
												text-xs-right
												v-if="list.list.ownerId !== user.auth.id && !list.list.pickerId"
											>
												<v-btn color="red lighten-2" @click="setPicker" dark round>
													<v-icon>mdi-hand-okay</v-icon>Pick list
												</v-btn>
											</v-flex>
										</v-toolbar>
										<v-divider class="pb-4"/>
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
													<tr @click="props.expanded = !props.expanded" v-if="!isMobile">
														<td class="text-xs-left">{{ props.item.id }}</td>
														<td class="text-xs-left">{{ props.item.item }}</td>
														<td class="text-xs-left">{{ props.item.quantity }}</td>
														<td class="text-xs-left">{{ props.item.unit }}</td>
														<td class="text-xs-left">{{ props.item.brand }}</td>
														<td v-if="list.list.pickerId" class="text-xs-left">
															<v-icon
																v-if="!list.list.isBought && list.list.pickerId === user.auth.id"
																@click="editItem(props.item)"
															>edit</v-icon>
															<v-icon
																v-if="list.list.pickerId && list.list.pickerId !== user.auth.id"
															>mdi-hand-okay</v-icon>
															<v-icon v-if="list.list.isBought">mdi-cash</v-icon>
															<v-icon v-if="list.list.isDelivered">mdi-truck-delivery</v-icon>
															<v-icon v-if="list.list.isConfirmed">mdi-credit-card</v-icon>
														</td>
														<td v-else class="text-xs-left">
															<v-icon v-if="!list.list.pickerId">mdi-account-clock</v-icon>
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
																	<v-icon
																		small
																		v-if="!list.list.isBought && list.list.pickerId === user.auth.id"
																		@click="editItem(props.item)"
																	>edit</v-icon>
																	<v-icon
																		small
																		v-if="list.list.pickerId && list.list.pickerId !== user.auth.id"
																	>mdi-hand-okay</v-icon>
																	<v-icon small v-if="list.list.isBought">mdi-cash</v-icon>
																	<v-icon small v-if="list.list.isDelivered">mdi-truck-delivery</v-icon>
																	<v-icon small v-if="list.list.isConfirmed">mdi-credit-card</v-icon>
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
													<v-card color="green lighten-5">
														<v-card-text>
															<v-layout row justify-space-around>
																<v-flex
																	xs-3
																	v-if="props.item.comments"
																	class="caption"
																>Owner's comments: {{ props.item.comments }}</v-flex>
																<v-flex
																	xs-3
																	v-if="props.item.cost"
																	class="caption"
																>Total cost: ${{ props.item.cost }}</v-flex>
																<v-flex
																	xs3
																	v-if="props.item.qtyBought"
																	class="caption"
																>Qty bought: {{ props.item.qtyBought }}</v-flex>
															</v-layout>
														</v-card-text>
													</v-card>
												</template>
											</v-data-table>
										</v-layout>
									</v-flex>
								</v-layout>
								<Address
									v-if="(list.list.pickerId === user.auth.id  && list.list.isBought) || list.list.ownerId === user.auth.id"
								/>
								<v-layout v-if="list.list.owner" row wrap py-4>
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
						</v-card>
					</v-flex>
				</v-layout>
			</v-form>
		</v-container>
		<v-dialog v-model="dialog" persistent max-width="290">
			<v-card>
				<v-card-title class="headline">Are you sure you want to proceed?</v-card-title>
				<v-card-text>After your confirmation, you cannot undo it.</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" flat="flat" @click="closeDialog(false)">Disagree</v-btn>
					<v-btn color="green darken-1" flat="flat" @click="closeDialog(true)">Agree</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { baseStoreImgUrl, baseProfilePicUrl } from '@/global';
import Map from '@/components/template/Map';
import EditItemPickerModal from './EditItemPickerModal';
import Address from './Address';
import moment from 'moment';
export default {
	name: 'ListDetails',
	components: { Map, EditItemPickerModal, Address },
	data() {
		return {
			receiptRules: [v => !!v || 'Receipt number is required'],
			isMobile: false,
			showModal: false,
			stores: [],
			valid: false,
			edit: false,
			expand: false,
			dialog: false,
			editedItem: {},
			pictureApiUrl: baseProfilePicUrl,
			baseLogoUrl: baseStoreImgUrl,
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
				{ text: 'Quantity', value: 'quantity', align: 'left' },
				{ text: 'Unit', value: 'unit', align: 'left' },
				{ text: 'Brand', value: 'brand', align: 'left' },
				{
					text: 'Actions',
					value: 'id',
					sortable: false,
					align: 'left',
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
			user: state => state.user,
		}),
		...mapGetters({
			getStoreImage: 'store/GET_SELECTED_STORE_IMAGE',
			getItemsSize: 'list/GET_ITEMS_LENGTH',
			getBoughtAt: 'list/GET_BOUGHT',
			getDeliveredAt: 'list/GET_DELIVERED',
			getConfirmedAt: 'list/GET_CONFIRMED',
		}),
	},

	methods: {
		pickList() {
			this.$store.dispatch('list/PICK_LIST');
			this.dialog = false;
		},
		async closeDialog(option) {
			if (option) {
				if (this.optionButton === 'bought') {
					if (!this.getBoughtAt) {
						await this.$store.dispatch(
							'list/UPDATE_STATUS',
							'bought'
						);
						this.dialog = false;
					} else {
						this.$store.commit(
							'showSnackbar',
							`You can't change it anymore`,
							{
								root: true,
							}
						);

						this.$store.commit('list/SET_IS_BOUGHT', false);
						this.dialog = false;
					}
				} else if (this.optionButton === 'delivered') {
					if (!this.getDeliveredAt) {
						await this.$store.dispatch(
							'list/UPDATE_STATUS',
							'delivered'
						);
						this.dialog = false;
					} else {
						this.$store.commit(
							'activeSnackbar',
							`You can't change it anymore`,
							{
								root: true,
							}
						);
						this.$store.commit('list/SET_IS_DELIVERED', false);
						this.dialog = false;
					}
				} else if (this.optionButton === 'confirmed') {
					if (!this.getConfirmedAt) {
						await this.$store.dispatch(
							'list/UPDATE_STATUS',
							'confirmed'
						);
						this.dialog = false;
					} else {
						this.$store.commit(
							'showSnackbar',
							`You can't change it anymore`,
							{
								root: true,
							}
						);
						this.$store.commit('list/SET_IS_CONFIRMED', false);
						this.dialog = false;
					}
				} else {
					this.pickList();
				}
			} else {
				switch (this.optionButton) {
					case 'bought':
						this.$store.commit('list/SET_IS_BOUGHT', false);
						break;
					case 'delivered':
						this.$store.commit('list/SET_IS_DELIVERED', false);
						break;
					case 'confirmed':
						this.$store.commit('list/SET_IS_CONFIRMED', false);
						break;
				}
				this.dialog = false;
			}
		},
		setBoughtTime() {
			this.optionButton = 'bought';
			this.dialog = true;
		},
		setPicker() {
			this.optionButton = 'pick';
			this.dialog = true;
		},
		setDeliveredTime() {
			this.optionButton = 'delivered';
			this.dialog = true;
		},
		setConfirmedTime() {
			this.optionButton = 'confirmed';
			this.dialog = true;
		},
		editItem(item) {
			this.$store.commit('list/SET_EDITED_ITEM', item);
			this.$store.commit('list/SHOW_MODAL');
		},
		onResize() {
			if (window.innerWidth < 769) this.isMobile = true;
			else this.isMobile = false;
		},
		getSelectedStore(id) {
			if (id) {
				return this.baseLogoUrl + this.getStoreImage(id);
			}
		},
		async save() {
			if (this.getItemsSize > 0) {
				await this.$store.dispatch('list/INSERT', this.$router);
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
		saveReceipt() {
			this.$store.dispatch('list/SAVE_RECEIPT');
		},
		editList() {
			const editLink = `${this.$route.params.id}/edit`;
			this.$router.push(editLink);
		},
	},
	created() {
		this.$store.dispatch('list/GET_LIST', this.$route.params.id);
		this.$store.dispatch('store/GET_STORES');
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
