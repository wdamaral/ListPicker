<template>
	<v-card>
		<v-form ref="form" v-model="valid" lazy-validation>
			<input id="user-id" type="hidden" v-model="user.id">
			<v-container>
				<v-layout row>
					<v-flex xs-12>
						<v-text-field
							label="Password"
							class="mr-3"
							ref="password"
							v-model="user.userRegistration.password"
							:append-icon="showP ? 'visibility' : 'visibility_off'"
							:rules="[rules.required, rules.minLength]"
							:type="showP ? 'text' : 'password'"
							hint="At least 8 characters"
							@click:append="showP = !showP"
						></v-text-field>
					</v-flex>
					<v-flex xs-12>
						<v-text-field
							label="Confirm password"
							class="ml-3"
							ref="password"
							v-model="user.userRegistration.confirmPassword"
							:append-icon="showC ? 'visibility' : 'visibility_off'"
							:rules="[rules.required, rules.confirmation]"
							:type="showC ? 'text' : 'password'"
							hint="At least 8 characters"
							@click:append="showC = !showC"
						></v-text-field>
					</v-flex>
				</v-layout>
				<v-layout row>
					<v-flex text-xs-center xs12>
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-avatar class="elevation-4" size="80" color="grey lighten-4">
									<v-img
										v-if="user.userRegistration.profilePicture"
										:src="tempImgUrl + user.userRegistration.profilePicture"
										@click="pickFile"
										class="cursor"
									/>
									<v-icon v-else light size="70" @click="pickFile">account_circle</v-icon>

									<input
										type="file"
										style="display: none"
										ref="image"
										accept="image/jpeg, image/jpg image/png, image/gif, image/png"
										@change="upload($event)"
									>
								</v-avatar>
							</template>
							<span>Upload new picture</span>
						</v-tooltip>
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
					<v-flex xs-6>
						<p class="text-xs-left">
							<v-btn icon flat @click="stepBack">
								<v-icon>arrow_back_ios</v-icon>
							</v-btn>
						</p>
					</v-flex>
					<v-flex xs-6>
						<p class="text-xs-right">
							<v-btn :disabled="!valid" color="success" @click="save">Finish</v-btn>
						</p>
					</v-flex>
				</v-layout>
			</v-container>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';
import { baseTempImgUrl } from '@/global';
export default {
	name: 'UserStep3',
	computed: {
		...mapState({
			user: state => state.user,
		}),
	},
	data() {
		return {
			imageName: '',
			valid: false,
			uploads: 0,
			showP: false,
			showC: false,
			tempImgUrl: baseTempImgUrl,
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
		save() {
			this.$store.dispatch('user/insert', this.$router);
		},
		stepBack() {
			this.$store.commit('user/stepBack');
		},
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
		pickFile() {
			this.$refs.image.click();
		},
		async upload(event) {
			let imageUrl = await this.$store.dispatch('UPLOAD', event);

			if (imageUrl) {
				this.$store.commit('user/SET_PROFILE_PICTURE', imageUrl);
			}
			this.$forceUpdate();
		},
	},
};
</script>

<style scoped>
.cursor {
	cursor: pointer;
}
</style>
