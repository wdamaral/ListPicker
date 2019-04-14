<template>
	<v-container fluid ma-0 pa-0>
		<v-layout v-if="wallet.transactions.transactions" row wrap>
			<v-flex xs12 sm6 md3 pt-5 :key="transac.id" v-for="transac in wallet.transactions.transactions">
				<v-card class="ma-1" min-height="160">
					<v-sheet
						class="v-sheet--offset mx-auto"
						:color="getColor(transac)"
						elevation="6"
						max-width="calc(100% - 32px)"
					>
						<div class="pa-1">
							<v-layout row justify-space-between>
								<h1 :class="transac.type === 'Withdraw' ? 'white--text': ''">{{transac.type}}</h1>
								<v-icon v-if="transac.type === 'Withdraw'" size="40" color="white">mdi-bank-transfer-out</v-icon>
								<v-icon v-else-if="transac.type === 'Deposit'" size="40">mdi-bank-transfer-in</v-icon>
								<v-icon v-else size="40">mdi-credit-card</v-icon>
							</v-layout>
						</div>
					</v-sheet>

					<v-card-text class="align-items-end pt-0">
						<v-layout column>
							<span
								v-if="transac.from  && transac.type === 'Payment'"
								class="caption grey--text font-weight-light"
							>From: {{transac.from.user.firstName}}</span>
							<span
								v-if="transac.to && transac.type === 'Payment'"
								class="caption grey--text font-weight-light"
							>To: {{transac.to.user.firstName}}</span>
							<span class="caption grey--text font-weight-light">Amount: {{transac.amount | toCurrency}}</span>
						</v-layout>
						<v-divider class="my-2"></v-divider>
						<v-icon class="mr-2" small>mdi-clock</v-icon>
						<span class="caption grey--text font-weight-light">{{transac.date | moment}}</span>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<v-layout row mt-4 justify-center>
			<div v-if="wallet.transactions.pagination" class="text-xs-center">
				<v-pagination
					color="green lighten-2"
					v-model="wallet.transactions.pagination.page"
					:length="wallet.transactions.pagination.pageCount"
					:total-visible="5"
					circle
					@input="loadTransactions(wallet.transactions.pagination.page)"
				></v-pagination>
			</div>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
export default {
	name: 'WalletTransactions',
	data() {
		return {
			page: 1,
		};
	},
	computed: {
		...mapState(['wallet']),
	},
	mounted() {
		this.loadTransactions(1);
	},
	filters: {
		toCurrency(value) {
			var formatter = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 2,
			});
			return formatter.format(value);
		},
		moment: date => {
			if (date) return moment(date).format('lll');

			return 'Nothing yet.';
		},
	},
	methods: {
		getColor(transac) {
			if (transac.type === 'Withdraw') {
				return 'red lighten-2';
			} else if (transac.type === 'Deposit') {
				return 'green lighten-2';
			} else {
				return 'lime   lighten-4';
			}
		},
		loadTransactions(page) {
			this.$store.dispatch('wallet/GET_TRANSACTIONS', {
				route: this.$route,
				page,
			});
		},
	},
};
</script>

<style>
</style>
