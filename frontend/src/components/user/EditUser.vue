<template>
	<div class="user-profile">
		<v-container>
			<v-layout row justify-space-between wrap pa-3>
				<v-flex>
					<v-form ref="form" lazy-validation v-model="valid">
						<v-card class="card--flex-toolbar">
							<v-toolbar card prominent class="green lighten-4 elevation-1">
								<v-avatar v-if="!edit" size="100" color="green lighten-2" class="elevation-4">
									<v-icon v-if="!user.data.profilePicture" light size="70">account_circle</v-icon>
									<img v-else :src="profileUrl + user.data.profilePicture" alt="avatar">
								</v-avatar>
								<div v-else>
									<v-tooltip bottom>
										<template v-slot:activator="{ on }">
											<v-avatar
												size="100"
												color="green lighten-2"
												class="elevation-4 cursor"
												@click="pickFile"
												v-on="on"
											>
												<img v-if="newPicture" :src="tempUrl + newPicture" alt="avatar">
												<img
													v-else-if="user.data.profilePicture"
													:src="profileUrl + user.data.profilePicture"
													alt="avatar"
												>
												<v-icon v-else dark size="70">account_circle</v-icon>
											</v-avatar>

											<input
												type="file"
												style="display: none"
												ref="image"
												accept="image/jpeg, image/jpg image/png, image/gif"
												@change="upload($event)"
											>
										</template>
										<span>Upload new picture</span>
									</v-tooltip>
								</div>
							</v-toolbar>

							<v-card-text>
								<v-layout row wrap v-if="user.auth.admin" justify-end>
									<v-flex xs1 mr-5>
										<v-switch color="success" :disabled="!edit" v-model="user.data.admin" label="Admin"></v-switch>
									</v-flex>
								</v-layout>
								<v-layout row wrap py-3>
									<v-flex xs12 sm6 px-3>
										<v-text-field
											label="First name"
											v-model="user.data.firstName"
											:disabled="!edit"
											required
											validate-on-blur
											:rules="[rules.required, rules.maxLength]"
										></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 px-3>
										<v-text-field
											label="Last name"
											v-model="user.data.lastName"
											:disabled="!edit"
											required
											validate-on-blur
											:rules="[rules.required, rules.maxLength]"
										></v-text-field>
									</v-flex>
								</v-layout>
								<v-layout row wrap py-3>
									<v-flex xs12 sm6 px-3>
										<v-text-field
											label="E-mail"
											append-icon="email"
											v-model="user.data.email"
											:disabled="!edit"
											required
											validate-on-blur
											:rules="[rules.required, rules.email]"
										></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 px-3>
										<v-text-field
											label="Phone number"
											append-icon="phone"
											v-model="user.data.phoneNumber"
											:disabled="!edit"
											mask="phone"
											required
											validate-on-blur
											:rules="[rules.required, rules.minLengthPhone]"
										></v-text-field>
									</v-flex>
								</v-layout>
								<v-layout row wrap py-3>
									<v-flex xs12 sm6 px-3>
										<v-text-field
											label="Password"
											ref="password"
											:append-icon="showP ? 'visibility' : 'visibility_off'"
											:rules="[rules.required, rules.minLengthPass]"
											:type="showP ? 'text' : 'password'"
											hint="At least 8 characters"
											@click:append="showP = !showP"
											:disabled="!edit"
											v-model="password"
											@input="validateForm"
											required
										></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 px-3>
										<v-text-field
											label="Confirm password"
											ref="confirmPassword"
											:append-icon="showC ? 'visibility' : 'visibility_off'"
											:rules="[rules.required, rules.confirmation]"
											:type="showC ? 'text' : 'password'"
											hint="At least 8 characters"
											@click:append="showC = !showC"
											:disabled="!edit"
											v-model="confirmPassword"
											validate-on-blur
											required
										></v-text-field>
									</v-flex>
								</v-layout>
								<v-divider></v-divider>
								<v-layout row wrap py-3>
									<v-flex xs12 sm6 px-3>
										<v-text-field
											label="Street"
											v-model="user.data.street"
											:disabled="!edit"
											required
											validate-on-blur
											:rules="[rules.required, rules.maxLengthAddress]"
										></v-text-field>
									</v-flex>
									<v-flex xs12 sm6 px-3>
										<v-text-field label="Unit #" v-model="user.data.unit" :disabled="!edit"></v-text-field>
									</v-flex>
								</v-layout>
								<v-layout row wrap py-3>
									<v-flex xs12 sm4 px-3>
										<v-text-field
											label="City"
											v-model="user.data.city"
											:disabled="!edit"
											required
											validate-on-blur
											:rules="[rules.required, rules.maxLength]"
										></v-text-field>
									</v-flex>
									<v-flex xs12 sm4 px-3>
										<v-text-field
											label="Province"
											v-model="user.data.province"
											:disabled="!edit"
											mask="AA"
											required
											validate-on-blur
											:rules="[rules.required, rules.province]"
										></v-text-field>
									</v-flex>
									<v-flex xs12 sm4 px-3>
										<v-text-field
											label="Postal code"
											v-model="user.data.postalCode"
											:disabled="!edit"
											mask="A#A #A#"
											required
											validate-on-blur
											:rules="[rules.required, rules.postalCode]"
										></v-text-field>
									</v-flex>
								</v-layout>

								<v-divider></v-divider>
							</v-card-text>
							<v-card-actions>
								<v-layout row>
									<v-flex xs12>
										<p class="text-xs-right">
											<v-btn v-if="!edit" color="orange" @click="editBtn" class="flex ma-1" round dark>
												<v-icon>edit</v-icon>Edit
											</v-btn>
											<v-btn
												v-else
												color="orange lighten-4 red--text"
												@click="cancelBtn"
												class="flex ma-1"
												round
											>
												<v-icon>mdi-cancel</v-icon>Cancel
											</v-btn>
											<v-btn :disabled="!valid || !edit" color="success" @click="save" class="flex ma-1" round>
												<v-icon>save</v-icon>Save
											</v-btn>
											<v-btn color="red" @click="dialog = true" class="flex ma-1" round dark>
												<v-icon>close</v-icon>Close account
											</v-btn>
										</p>
									</v-flex>
								</v-layout>
							</v-card-actions>
						</v-card>
					</v-form>
				</v-flex>
			</v-layout>
		</v-container>
		<v-dialog v-model="dialog" persistent max-width="290">
			<v-card>
				<v-card-title class="headline">Are you sure you want to close your account?</v-card-title>
				<v-card-text>After your confirmation, you will not be able to access to system anymore.</v-card-text>
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
import { mapState } from 'vuex';
import { baseTempImgUrl, baseProfilePicUrl } from '@/global';
export default {
	name: 'UserProfile',
	data() {
		return {
			valid: false,
			dialog: false,
			edit: false,
			showP: false,
			showC: false,
			password: null,
			newPicture: null,
			confirmPassword: null,
			tempUrl: baseTempImgUrl,
			profileUrl: baseProfilePicUrl,
			rules: {
				required: v => !!v || 'Required field.',
				minLengthPhone: v =>
					(v && v.length >= 10) || 'Phone number must be 10 digits',
				minLengthPass: v =>
					(v && v.length >= 8) ||
					'Password must contain at least 8 characters',
				maxLength: v =>
					(v && v.length <= 50) ||
					'It must be less than 50 characters',
				maxLengthAddress: v =>
					(v && v.length <= 100) ||
					'It must be less than 100 characters',
				province: v =>
					(v && v.length <= 2) || 'Province with only 2 characters',
				postalCode: v =>
					(v && /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(v)) ||
					'Postal code is invalid.',
				email: v => (v && /.+@.+/.test(v)) || 'E-mail must be valid',
				confirmation: v =>
					(v && v === this.password) || 'Password must match.',
			},
		};
	},
	computed: {
		...mapState({
			user: state => state.user,
		}),
	},
	methods: {
		validateForm() {
			this.$refs.form.validate();
		},
		setPassword(e) {
			this.$store.commit('user/SET_PASSWORD', e);
		},
		setConfirmPassword(e) {
			this.$store.commit('user/SET_CONFIRMPASSWORD', e);
		},
		editBtn() {
			return (this.edit = !this.edit);
		},
		pickFile() {
			this.$refs.image.click();
		},
		save() {
			if (this.password && this.confirmPassword) {
				this.setPassword(this.password);
				this.setConfirmPassword(this.confirmPassword);
			}
			this.$store.commit(
				'user/SET_PROFILE_PICTURE_USER_EDIT',
				this.newPicture
			);
			this.$store.dispatch('user/update', this.$router);
		},
		async upload(event) {
			let imageUrl = await this.$store.dispatch('UPLOAD', event);

			if (imageUrl) {
				// this.$store.commit('user/SET_PROFILE_PICTURE', imageUrl);
				this.newPicture = imageUrl;
			}
			this.$forceUpdate();
		},
		loadUser() {
			this.$store.dispatch('user/getUser', this.$route.params.id);
		},
		cancelBtn() {
			this.$router.go(-1);
		},
		closeDialog(option) {
			if (option) {
				this.$store.dispatch('user/CLOSE_ACCOUNT', this.$router);
				this.dialog = false;
			} else {
				this.dialog = false;
			}
		},
	},
	mounted() {
		this.loadUser();
	},
};
</script>

<style scoped>
.cursor {
	cursor: pointer;
}
</style>
