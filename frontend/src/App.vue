<template>
	<v-app>
		<app-navigation/>
		<Loading v-if="validatingToken"/>
		<v-content v-else transition="slide-x-transition">
			<router-view></router-view>
		</v-content>
		<v-snackbar v-model="snackbar" bottom :timeout="timeout">
			{{ snackText }}
			<v-btn color="pink" flat @click="hideSnackbar">Close</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
import AppNavigation from '@/components/template/AppNavigation';
import Loading from '@/components/template/Loading';

import { mapState } from 'vuex';
import axios from 'axios';
import { baseApiUrl, userKey } from '@/global';
export default {
	name: 'App',
	data() {
		return {
			validatingToken: true,
		};
	},
	components: { AppNavigation, Loading },
	computed: {
		...mapState({
			user: state => state.user,
			snackbar: state => state.snackbar,
			snackText: state => state.snackText,
			timeout: state => state.timeout,
		}),
	},
	methods: {
		hideSnackbar() {
			this.$store.commit('hideSnackbar');
		},
		async validateToken() {
			this.validateToken = true;

			const json = localStorage.getItem(userKey);
			const userData = JSON.parse(json);
			this.$store.commit('user/SET_AUTH', null);

			if (!userData) {
				this.validatingToken = false;
				// 	if(this.$route.name !== 'home') {
				// 		return this.$router.push({ name: 'login' })
				// 	}
				// 	return this.$router.push({ name: 'home' })
			} else {
				const res = await axios.post(
					`${baseApiUrl}/validateToken`,
					userData
				);

				if (res.data) {
					this.$store.commit('user/SET_AUTH', userData);
				} else {
					localStorage.removeItem(userKey);
					this.$router.push({ name: 'home' });
				}

				this.validatingToken = false;
			}
		},
	},
	created() {
		this.validateToken();
	},
};
</script>
<style>
</style>
