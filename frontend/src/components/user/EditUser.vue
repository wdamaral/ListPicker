<template>
	<div class="user-profile">
		<v-container>
			<v-layout row justify-space-between wrap pa-3>
				<v-flex>
					<v-card class="card--flex-toolbar">
						<v-toolbar card prominent class="green lighten-4 elevation-1">
							<v-avatar v-if="!edit" size="100" color="green lighten-2" class="elevation-4">
								<v-icon v-if="!user.data.profilePicture" light size="70">account_circle</v-icon>
								<img v-else :src="getPath + user.data.profilePicture" alt="avatar">
							</v-avatar>
							<v-tooltip v-else bottom>
								<template v-slot:activator="{ on }">
									<v-avatar
										size="100"
										color="green lighten-2"
										class="elevation-4"
										@click="pickFile"
										v-on="on"
									>
										<v-icon v-if="!user.data.profilePicture" light size="70" @click="pickFile">account_circle</v-icon>
										<img v-else :src="getPath + user.data.profilePicture" alt="avatar">
									</v-avatar>
								</template>
								<span>Upload new picture</span>
							</v-tooltip>
							<input
								type="file"
								style="display: none"
								ref="image"
								accept="image/jpeg, image/jpg image/png, image/gif"
								@change="upload($event)"
							>
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
										:rules="[rules.required, rules.maxLength]"
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 px-3>
									<v-text-field
										label="Last name"
										v-model="user.data.lastName"
										:disabled="!edit"
										required
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
										@input="setPassword"
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
										@input="setConfirmPassword"
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
										<v-btn :disabled="!valid" color="red" @click="dialog = true" class="flex ma-1" round dark>
											<v-icon>close</v-icon>Close account
										</v-btn>
									</p>
								</v-flex>
							</v-layout>
						</v-card-actions>
					</v-card>
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
import { baseApiUrl } from '@/global';
export default {
	name: 'UserProfile',
	data() {
		return {
			valid: true,
			dialog: false,
			edit: false,
			showP: false,
			showC: false,
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
					(v && v === this.$refs.password.value) ||
					'Password must match.',
			},
		};
	},
	computed: {
		...mapState({
			user: state => state.user,
		}),
		getPath() {
			return baseApiUrl + '/uploads/users/';
		},
	},
	methods: {
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
			this.$store.dispatch('user/update', this.$router);
		},
		upload(event) {
			this.$store.dispatch('user/upload', event);
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

<style>
</style>
