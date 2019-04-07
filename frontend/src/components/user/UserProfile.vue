<template>
	<div class="user-profile">
		<v-container v-if="user.data">
			<v-layout row justify-space-between wrap pa-3>
				<v-flex xs12 md10 offset-md1>
					<v-card class="card--flex-toolbar">
						<v-toolbar card prominent class="green lighten-4 elevation-1">
							<v-avatar size="100" color="green lighten-2" class="elevation-4">
								<v-icon v-if="!user.data.profilePicture" size="60" dark>account_circle</v-icon>
								<img v-else :src="`${imgSrc}${user.data.profilePicture}`" alt="avatar">
							</v-avatar>
							<p class="headline pl-4">Hi, I'm {{user.data.firstName}}</p>
							<v-spacer/>
							<v-btn icon v-if="checkUser" @click="editUser" class="green lighten-2">
								<v-icon>mdi-account-edit</v-icon>
							</v-btn>
						</v-toolbar>

						<v-card-text>
							<div
								class="body-2 text-xs-right font-weight-light"
							>Joined in {{user.data.createdAt | moment}}</div>
							<v-container fluid>
								<p class="pt-4">
									<v-icon large>format_quote</v-icon>
								</p>
								<p class="pl-4 body-1">This is just me.</p>
								<p class="pb-4">
									<v-icon large>format_quote</v-icon>
								</p>
								<p class="body-2 font-weight-light">
									<v-icon small>local_grocery_store</v-icon>
									Last list fulfilled: {{ lastListFulfilled | moment }}
								</p>
								<p class="body-2 font-weight-light">
									<v-icon small>time_to_leave</v-icon>
									Last delivery made: {{ lastDeliveryConfirmed | moment }}
								</p>
								<p class="body-2 font-weight-light">
									<v-icon small>assignment_turned_in</v-icon>
									Last list picked: {{lastListPicked | moment }}
								</p>
								<v-layout row wrap pa-3>
									<v-flex xs12>
										<p class="body-2 font-weight-light">
											<v-icon small>house</v-icon>
											Lives in {{user.data.city}}
										</p>
										<v-divider></v-divider>
									</v-flex>
								</v-layout>
								<v-layout row wrap pa-3 align-content-center>
									<v-flex xs12>
										<p class="text-xs-center">
											<Map :latitude="user.data.latitude" :longitude="user.data.longitude"/>
										</p>
									</v-flex>
								</v-layout>
							</v-container>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import { baseApiUrl } from '@/global';
import Map from '@/components/template/Map';
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';

export default {
	name: 'UserProfile',
	components: { Map },
	data() {
		return {
			imgSrc: `${baseApiUrl}/uploads/users/`,
		};
	},
	computed: {
		...mapState({ user: state => state.user }),
		...mapGetters('user', [
			'lastListFulfilled',
			'lastListPicked',
			'lastDeliveryConfirmed',
			'activeLists',
		]),
		checkUser() {
			if (
				this.user.auth.admin ||
				this.user.auth.id === Number(this.$route.params.id)
			) {
				return true;
			}
			return false;
		},
	},
	filters: {
		moment: date => {
			if (date) return moment(date).format('MMMM Do, YYYY');

			return 'Nothing yet.';
		},
	},
	mounted() {
		this.$store.dispatch('user/getUser', this.$route.params.id);
	},
	methods: {
		editUser() {
			this.$router.push({
				name: 'userEdit',
				params: { id: this.user.data.id },
			});
		},
	},
};
</script>

<style>
</style>
