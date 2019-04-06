<template>
	<div class="user-profile">
		<v-container>
			<v-layout row justify-space-between wrap pa-3>
				<v-flex>
					<v-card class="card--flex-toolbar">
						<v-toolbar card prominent class="green lighten-4 elevation-1">
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-avatar
										size="100"
										color="grey lighten-4"
										class="elevation-4"
										@click="pickFile"
										v-on="on"
									>
										<img
											v-if="!user.data.profilePicture"
											:src="require('../../assets/avatar_profile.png')"
											alt="avatar"
										>
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
							<v-spacer></v-spacer>
							<v-flex></v-flex>
							<v-switch color="success" v-model="user.data.admin" label="Admin"></v-switch>
						</v-toolbar>

						<v-card-text>
							<v-layout row wrap py-3>
								<v-flex xs12 sm6 px-3>
									<v-text-field label="First name" v-model="user.data.firstName" :disabled="!edit"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 px-3>
									<v-text-field label="Last name" v-model="user.data.lastName" :disabled="!edit"></v-text-field>
								</v-flex>
							</v-layout>
							<v-layout row wrap py-3>
								<v-flex xs12 sm6 px-3>
									<v-text-field
										label="E-mail"
										append-icon="email"
										v-model="user.data.email"
										:disabled="!edit"
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 px-3>
									<v-text-field
										label="Phone number"
										append-icon="phone"
										v-model="user.data.phoneNumber"
										:disabled="!edit"
									></v-text-field>
								</v-flex>
							</v-layout>
							<v-layout row wrap py-3>
								<v-flex xs12 sm6 px-3>
									<v-text-field
										label="Password"
										:append-icon="showP ? 'visibility' : 'visibility_off'"
										:rules="passwordRules"
										:type="showP ? 'text' : 'password'"
										hint="At least 8 characters"
										@click:append="showP = !showP"
										:disabled="!edit"
										@input="setPassword"
									></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 px-3>
									<v-text-field
										label="Confirm password"
										ref="password"
										:append-icon="showC ? 'visibility' : 'visibility_off'"
										:rules="confirmPasswordRules"
										:type="showC ? 'text' : 'password'"
										hint="At least 8 characters"
										@click:append="showC = !showC"
										:disabled="!edit"
										@input="setConfirmPassword"
									></v-text-field>
								</v-flex>
							</v-layout>
							<v-divider></v-divider>
							<v-layout row wrap py-3>
								<v-flex xs12 sm6 px-3>
									<v-text-field label="Street" v-model="user.data.street" :disabled="!edit"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 px-3>
									<v-text-field label="Unit #" v-model="user.data.unit" :disabled="!edit"></v-text-field>
								</v-flex>
							</v-layout>
							<v-layout row wrap py-3>
								<v-flex xs12 sm4 px-3>
									<v-text-field label="City" v-model="user.data.city" :disabled="!edit"></v-text-field>
								</v-flex>
								<v-flex xs12 sm4 px-3>
									<v-text-field label="Province" v-model="user.data.province" :disabled="!edit"></v-text-field>
								</v-flex>
								<v-flex xs12 sm4 px-3>
									<v-text-field label="Postal code" v-model="user.data.postalCode" :disabled="!edit"></v-text-field>
								</v-flex>
							</v-layout>

							<v-divider></v-divider>
						</v-card-text>
						<v-card-actions>
							<v-layout row>
								<v-flex xs12>
									<p class="text-xs-right">
										<v-btn :disabled="!valid" color="orange" @click="editBtn" class="flex ma-1" round dark>
											<v-icon>edit</v-icon>Edit
										</v-btn>
										<v-btn :disabled="!valid || !edit" color="success" @click="save" class="flex ma-1" round>
											<v-icon>save</v-icon>Save
										</v-btn>
										<v-btn :disabled="!valid" color="red" class="flex ma-1" round dark>
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
			edit: false,
			showP: false,
			showC: false,
			passwordRules: [
				v => !!v || 'Password is required',
				v =>
					(v && v.length >= 8) ||
					'Password must have at least 8 characters',
			],
			confirmPasswordRules: [
				v => !!v || 'Confirmation password is required',
			],
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
	},
	mounted() {
		this.$store.dispatch('user/getUser', this.$route.params.id);
	},
};
</script>

<style>
</style>
