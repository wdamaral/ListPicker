<template>
	<v-container grid-list-xs-24>
		<v-layout row>
			<v-flex></v-flex>
		</v-layout>
		<v-layout row wrap fill-height justify-space-around>
			<v-flex x12 md4>
				<WalletTransaction transacType="Deposit"/>
			</v-flex>
			<v-flex xs12 md2 text-xs-center order-1 align-self-center>
				<h4 class="display-1">Balance {{wallet.data.balance | toCurrency}}</h4>
			</v-flex>
			<v-flex x12 md4>
				<WalletTransaction transacType="Withdraw"/>
			</v-flex>
		</v-layout>
		<v-layout row column mt-4>
			<h4 class="display-1">Last transactions</h4>
			<v-divider class="my-3"></v-divider>
			<WalletTransactions/>
		</v-layout>
	</v-container>
</template>

<script>
import WalletTransaction from './WalletTransaction';
import WalletTransactions from './WalletTransactions';
import { mapState } from 'vuex';
export default {
	name: 'WalletHome',
	components: { WalletTransaction, WalletTransactions },
	mounted() {
		this.$store.dispatch('wallet/GET_WALLET', this.$route);
	},
	computed: mapState(['wallet']),
	filters: {
		toCurrency(value) {
			var formatter = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 2,
			});
			return formatter.format(value);
		},
	},
};
</script>

<style>
</style>
