<template>
	<div class="pt-4">
		<v-card class="mt-3 mx-auto" max-width="400">
			<v-sheet
				class="v-sheet--offset mx-auto"
				:color="transacType === 'Withdraw' ? 'red lighten-2' : 'green lighten-3'"
				elevation="6"
				max-width="calc(100% - 32px)"
			>
				<div class="pa-4">
					<v-layout row justify-space-between>
						<h1 :class="transacType === 'Withdraw' ? 'white--text': ''">{{transacType}}</h1>
						<v-icon v-if="transacType === 'Withdraw'" size="40" color="white">mdi-bank-transfer-out</v-icon>
						<v-icon v-else size="40">mdi-bank-transfer-in</v-icon>
					</v-layout>
				</div>
			</v-sheet>

			<v-card-text class="pt-0">
				<v-form ref="form" @submit="dialog=true" v-on:submit.prevent v-model="valid">
					<div class="subheading font-weight-light grey--text">
						<v-text-field
							type="number"
							prefix="$"
							label="Amount"
							v-model="amount"
							:rules="[rules.required, rules.positive]"
							required
						></v-text-field>
					</div>
					<div class="text-xs-center">
						<div v-if="transacType === 'Withdraw'">
							<v-btn type="submit" :disabled="!valid" :dark="valid" block color="red lighten-2">Confirm</v-btn>
						</div>
						<div v-else>
							<v-btn type="submit" :disabled="!valid" block color="green lighten-3">
								<v-icon>mdi-bank-transfer-in</v-icon>Confirm
							</v-btn>
						</div>
					</div>
				</v-form>
			</v-card-text>
		</v-card>
		<v-dialog v-model="dialog" persistent max-width="290">
			<v-card>
				<v-card-title class="headline">Do you confirm the {{transacType}} ?</v-card-title>
				<v-card-text>You will {{transacType}} {{amount | toCurrency}}.</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" flat="flat" @click="confirmTransaction(false)">No</v-btn>
					<v-btn color="green darken-1" flat="flat" @click="confirmTransaction(true)">Yes</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'WalletTransaction',
	props: {
		transacType: String,
	},
	data() {
		return {
			dialog: false,
			amount: 0,
			valid: false,
			rules: {
				required: v => !!v || 'Amount is required.',
				positive: v => (v && v > 0) || 'Amount must be greater than 0',
			},
		};
	},
	methods: {
		confirmTransaction(isConfirmed) {
			this.dialog = false;
			if (isConfirmed) {
				this.$store.dispatch('wallet/NEW_TRANSACTION', {
					route: this.$route,
					amount: this.amount,
					transacType: this.transacType,
				});
			}
			this.$refs.form.reset();
		},
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
	},
	computed: mapState(['wallet']),
};
</script>

<style>
.v-sheet--offset {
	top: -24px;
	position: relative;
}
</style>
