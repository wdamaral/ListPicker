<template>
	<NoLists v-if="list.lists.lists.length == 0"/>
	<v-container v-else grid-list-md>
		<PageTitle :icon="getIcon()" :main="getMain()"/>
		<v-layout fill-height row wrap>
			<v-flex v-for="item in list.lists.lists" :key="item.id" xs12 sm6 lg3>
				<v-hover>
					<v-card
						slot-scope="{ hover }"
						class="mx-auto"
						:class=" `elevation-${hover ? 9 : 2}`"
						color="white"
						light
						max-width="400"
						@click="seeDetails(item.id)"
						style="cursor: pointer;"
					>
						<v-card-title>
							<v-img max-height="30" width="160" v-bind:src="baseLogoUrl + item.store.imageUrl"></v-img>
						</v-card-title>

						<v-card-text class="caption">
							<p>
								<v-icon small>mdi-calendar</v-icon>
								{{ item.createdAt | moment }}
							</p>
						</v-card-text>

						<v-card-actions>
							<v-list-tile class="grow">
								<v-list-tile-avatar v-if="item.owner.profilePicture" color="grey darken-3">
									<v-img class="elevation-6" :src="baseUrl + item.owner.profilePicture"></v-img>
								</v-list-tile-avatar>

								<v-list-tile-avatar v-else color="grey darken-5">
									<v-icon dark>account_circle</v-icon>
								</v-list-tile-avatar>

								<v-list-tile-content>
									<v-list-tile-title>{{ item.owner.fistName }}</v-list-tile-title>
								</v-list-tile-content>

								<v-layout align-center justify-end>
									<v-icon class="mr-1">mdi-cart</v-icon>
									<span class="subheading">{{ item.totalItems }}</span>
								</v-layout>
							</v-list-tile>
						</v-card-actions>
					</v-card>
				</v-hover>
			</v-flex>
		</v-layout>
		<v-layout fill-height row mt-4 justify-center>
			<div v-if="list.lists.pagination" class="text-xs-center">
				<v-pagination
					color="green lighten-2"
					v-model="list.lists.pagination.page"
					:length="list.lists.pagination.pageCount"
					:total-visible="5"
					circle
					@input="loadTransactions(list.lists.pagination.page)"
				></v-pagination>
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import { baseProfilePicUrl, baseStoreImgUrl } from '@/global';
import moment from 'moment';
import NoLists from './NoLists';
import PageTitle from '@/components/template/PageTitle';
export default {
	name: 'Lists',
	data() {
		return {
			baseUrl: baseProfilePicUrl,
			baseLogoUrl: baseStoreImgUrl,
		};
	},
	computed: {
		...mapState({
			list: state => state.list,
		}),
		numberOfItems() {
			return this.$store.getters['list/GET_ITEMS_LENGTH'];
		},
	},
	filters: {
		moment: date => {
			if (date) return moment(date).format('MMMM Do, YYYY');

			return '';
		},
	},
	created() {
		this.fetchData();
	},
	watch: {
		$route: 'fetchData',
	},
	methods: {
		fetchData() {
			switch (this.$route.path) {
				case '/lists':
					this.$store.dispatch('list/GET_LISTS');
					break;
				case '/lists/mylists':
					this.$store.dispatch('list/GET_MY_LISTS');
					break;
				case '/lists/mypicks':
					this.$store.dispatch('list/GET_MY_PICKS');
					break;

				case '/lists/history':
					this.$store.dispatch('list/GET_MY_HISTORY');
					break;
			}
		},
		seeDetails(id) {
			this.$router.push(`/lists/${id}`);
		},
		getMain() {
			if (this.$route.name === 'myPicks') {
				return 'My List Picking';
			} else if (this.$route.name === 'myLists') {
				return 'My Lists';
			} else if (this.$route.name === 'history') {
				return 'My History';
			} else {
				return 'All lists';
			}
		},
		getIcon() {
			if (this.$route.name === 'myPicks') {
				return 'mdi-hand-okay';
			} else if (this.$route.name === 'myLists') {
				return 'mdi-format-list-checkbox';
			} else if (this.$route.name === 'history') {
				return 'mdi-receipt';
			} else {
				return 'mdi-view-list';
			}
		},
	},
	components: { NoLists, PageTitle },
};
</script>

<style>
</style>
