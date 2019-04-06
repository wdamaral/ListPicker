<template>
	<v-layout fill-height align-center mx-3>
		<v-flex xs12 sm6 offset-sm3>
			<v-card>
				<v-img
					class="white--text"
					height="200px"
					:src="require('@/assets/home/pexels-photo-95425.jpeg')"
				></v-img>
				<v-form lazy-validation v-on:submit.prevent @submit="forgotPassword" v-model="valid">
					<v-card-text class="pa-4 text-xs-center">
						<v-layout v-if="model !== 'reset'" row pa-3>
							<v-flex xs12>
								<v-text-field
									prepend-inner-icon="email"
									v-model="user.email"
									:rules="[rules.required, rules.email]"
									label="E-mail"
									required
								></v-text-field>
							</v-flex>
						</v-layout>
						<div v-else>
							<v-layout row pa-3>
								<v-flex xs12>
									<v-text-field
										validate-on-blur
										v-model="user.password"
										ref="password"
										:append-icon="show1 ? 'visibility' : 'visibility_off'"
										:rules="[rules.required, rules.minLength]"
										:type="show1 ? 'text' : 'password'"
										prepend-inner-icon="security"
										label="New password"
										@click:append="show1 = !show1"
										required
									></v-text-field>
								</v-flex>
							</v-layout>
							<v-layout row pa-3>
								<v-flex xs12>
									<v-text-field
										v-model="user.confirmPassword"
										validate-on-blur
										:append-icon="show2 ? 'visibility' : 'visibility_off'"
										:rules="[rules.required, rules.minLength, rules.confirmation]"
										:type="show2 ? 'text' : 'password'"
										prepend-inner-icon="security"
										label="Confirm new password"
										@click:append="show2 = !show2"
										required
									></v-text-field>
								</v-flex>
							</v-layout>
						</div>
					</v-card-text>
				</v-form>
				<v-card-actions class="text-xs-right">
					<v-btn type="submit" flat :disabled="!valid" color="green" @click="forgotPassword">
						{{ buttonWord() }}
						<v-icon>mdi-send-lock</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
export default {
	name: 'PasswordChange',
	data() {
		return {
			user: {
				password: '',
				confirmPassword: '',
			},
			model: '',
			show1: false,
			show2: false,
			valid: false,
			rules: {
				required: value => !!value || 'Required field.',
				minLength: value =>
					value.length >= 8 ||
					'Password must contain at least 8 characters',
				confirmation: value =>
					value === this.$refs.password.value ||
					'Password must match.',
				email: v => /.+@.+/.test(v) || 'E-mail must be valid',
			},
		};
	},
	methods: {
		login() {
			this.$store.dispatch('user/PASSWORD_CHANGE', {
				payload: this.user,
				router: this.$router,
			});
		},
		forgotPassword() {
			if (this.$route.name === 'forgotPassword') {
				this.$store.dispatch('user/FORGOT_PASSWORD', {
					email: this.user.email,
					route: this.$route,
				});
			} else {
				this.$store.dispatch('user/RESET_PASSWORD', {
					user: this.user,
					route: this.$route,
					router: this.$router,
				});
			}
		},
		buttonWord() {
			if (this.$route.name === 'forgotPassword') {
				return 'Send email';
			}
			return 'Change password';
		},
	},
	created() {
		if (this.$route.name === 'forgotPassword') {
			this.model = 'forgot';
		} else {
			this.model = 'reset';
		}
	},
};
</script>

<style>
.item {
	max-height: 300px;
	max-width: 300px;
}
</style>
