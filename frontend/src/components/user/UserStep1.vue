<template>
	<v-card>
		<v-form ref="form" v-model="valid" lazy-validation>
			<v-container>
				<v-layout row>
					<v-flex xs-12>
						<v-text-field
							v-model="user.userRegistration.firstName"
							:counter="50"
							:rules="[rules.required, rules.maxLength]"
							label="First name"
							required
						></v-text-field>
					</v-flex>
					<v-flex xs-12>
						<v-text-field
							v-model="user.userRegistration.lastName"
							:counter="50"
							:rules="[rules.required, rules.maxLength]"
							label="Last name"
							required
						></v-text-field>
					</v-flex>
				</v-layout>
				<v-layout row>
					<v-flex xs-12>
						<v-text-field
							append-icon="email"
							v-model="user.userRegistration.email"
							:rules="[rules.required, rules.email]"
							label="E-mail"
							required
						></v-text-field>
					</v-flex>
					<v-flex xs-12>
						<v-text-field
							append-icon="phone"
							mask="phone"
							v-model="user.userRegistration.phoneNumber"
							:rules="[rules.required, rules.minLength]"
							label="Phone number"
							required
						></v-text-field>
					</v-flex>
				</v-layout>
				<v-layout row>
					<v-flex xs-12>
						<v-icon small class="red--text">lock</v-icon>
						<span class="caption red--text">Don't worry, we won't share any information.</span>
					</v-flex>
				</v-layout>
			</v-container>
		</v-form>
		<v-divider></v-divider>
		<v-card-actions>
			<v-container fluid>
				<v-layout row>
					<v-flex xs-12>
						<p class="text-xs-right">
							<v-btn :disabled="!valid" color="success" @click="validate">Next</v-btn>
						</p>
					</v-flex>
				</v-layout>
			</v-container>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'UserStep1',
	computed: {
		...mapState({
			user: state => state.user,
		}),
	},
	data() {
		return {
			valid: false,
			rules: {
				required: value => !!value || 'Required field.',
				minLength: v =>
					(v && v.length >= 10) || 'Phone number must be 10 digits',
				maxLength: v =>
					(v && v.length <= 50) ||
					'Name must be less than 50 characters',
				email: v => (v && /.+@.+/.test(v)) || 'E-mail must be valid',
			},
		};
	},
	methods: {
		nextStep() {
			this.$store.commit('user/nextStep');
		},
		validate() {
			if (this.$refs.form.validate()) {
				this.$store.commit('user/nextStep');
			}
		},
		reset() {
			this.$refs.form.reset();
			this.$refs.form.resetValidation();
			this.$store.commit('user/resetStep');
		},
	},
};
</script>

<style>
</style>
