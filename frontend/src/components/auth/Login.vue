<template>
	<v-layout fill-height justify-center mx-3>
		<v-flex pa-4 xs10 sm8 md5 align-self-center>
			<v-card>
				<v-img
					class="white--text"
					height="200px"
					:src="require('@/assets/home/pexels-photo-95425.jpeg')"
				></v-img>
				<v-form v-on:submit.prevent lazy-validation v-model="valid" @submit="login">
					<v-card-text class="pa-4 text-xs-center">
						<v-layout row pa-3>
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
						<v-layout row pa-3>
							<v-flex xs12>
								<v-text-field
									v-model="user.password"
									:append-icon="show1 ? 'visibility' : 'visibility_off'"
									:rules="[rules.required]"
									:type="show1 ? 'text' : 'password'"
									prepend-inner-icon="security"
									label="Password"
									@click:append="show1 = !show1"
									required
								></v-text-field>
							</v-flex>
						</v-layout>
						<v-layout column>
							<v-flex class="text-xs-right" xs12>
								<router-link to="/forgot-password">Forgot password?</router-link>
							</v-flex>
						</v-layout>
					</v-card-text>
					<v-card-actions class="text-xs-right">
						<v-btn type="submit" :disabled="!valid" flat color="green">
							<v-icon>mdi-login-variant</v-icon>Login
						</v-btn>
					</v-card-actions>
				</v-form>
				<v-divider class="pb-3"/>
				<v-layout py-3 row justify-center>
					<v-img max-height="50" max-width="50" :src="require('@/assets/or.png')"></v-img>
				</v-layout>
				<v-layout pb-3 row justify-center>
					<v-btn dark color="green lighten-1" @click="signup">Click here to register</v-btn>
				</v-layout>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
export default {
	name: 'Login',
	data() {
		return {
			user: {},
			show1: false,
			valid: false,
			rules: {
				required: v => !!v || 'Required field.',
				email: v => /.+@.+/.test(v) || 'E-mail must be valid',
			},
		};
	},
	methods: {
		login() {
			this.$store.dispatch('user/LOGIN', {
				user: this.user,
				router: this.$router,
			});
		},
		signup() {
			this.$router.push('/signin');
		},
	},
};
</script>

<style>
.item {
	max-height: 300px;
	max-width: 300px;
}
</style>
