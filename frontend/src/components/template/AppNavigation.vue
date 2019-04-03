<template>
	<div>
		<v-toolbar app color="red" dark clipped-left clipped-right>
			<v-toolbar-side-icon v-if="user.data" @click="drawer = !drawer"></v-toolbar-side-icon>
			<v-spacer class="hidden-md-and-up"></v-spacer>

			<img
				:src="require('../../assets/logo.png')"
				id="logo"
				class="hidden-sm-and-down"
				alt="Grocery List Picker"
			>
			<v-toolbar-title class="white--text">
				<router-link to="/">{{appTitle}}</router-link>
			</v-toolbar-title>

			<img
				:src="require('../../assets/logo.png')"
				id="logo"
				class="hidden-md-and-up"
				alt="Grocery List Picker"
			>
			<v-spacer class="hidden-sm-and-down"></v-spacer>
			<v-btn v-if="!user.data" flat class="hidden-sm-and-down" @click="login">SIGN IN</v-btn>
			<v-btn v-if="user.data" flat @click="logout" class="hidden-sm-and-down">LOGOUT</v-btn>
			<v-btn v-if="!user.data" color="teal lighten-2" class="hidden-sm-and-down" @click="signup">JOIN</v-btn>
		</v-toolbar>
		<v-navigation-drawer v-if="user.data" v-model="drawer" :mini-variant="mini" dark temporary fixed>
			<v-list class="pa-1">
				<v-list-tile v-if="mini" @click.stop="mini = !mini">
					<v-list-tile-action>
						<v-icon>chevron_right</v-icon>
					</v-list-tile-action>
				</v-list-tile>

				<v-list-tile avatar tag="div">
					<v-list-tile-avatar v-if="user.data.profilePicture">
						<img :src="baseUrl + user.data.profilePicture">
					</v-list-tile-avatar>
					<v-list-tile-avatar v-else>
						<v-icon size="30" dark>account_circle</v-icon>
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title>{{user.data.firstName}}</v-list-tile-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<v-btn icon @click.stop="mini = !mini">
							<v-icon>chevron_left</v-icon>
						</v-btn>
					</v-list-tile-action>
				</v-list-tile>
			</v-list>
			<v-list class="pt-1">
				<v-divider light></v-divider>
				<v-list-tile route to="/">
					<v-list-tile-action>
						<v-icon class="white--text">home</v-icon>
					</v-list-tile-action>

					<v-list-tile-content>
						<v-list-tile-title class="white--text">Home</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>

			<v-list class="pt-0" subheader>
				<v-subheader>Grocery lists</v-subheader>
				<v-divider light></v-divider>
				<v-list-tile v-for="item in items" :key="item.title" route :to="item.route">
					<v-list-tile-action>
						<v-icon class="white--text">{{ item.icon }}</v-icon>
					</v-list-tile-action>

					<v-list-tile-content>
						<v-list-tile-title class="white--text">{{ item.title }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>

			<v-list class="pt-1" subheader>
				<v-divider light></v-divider>

				<v-subheader>Admin</v-subheader>
				<v-list-tile v-for="item in itemsAdmin" :key="item.title" route :to="item.route">
					<v-list-tile-action>
						<v-icon class="white--text">{{ item.icon }}</v-icon>
					</v-list-tile-action>

					<v-list-tile-content>
						<v-list-tile-title class="white--text">{{ item.title }}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { baseApiUrl, baseProfilePicUrl } from "@/global";
export default {
	name: "AppNavigation",
	computed: {
		...mapState({
			user: state => state.user
		})
	},
	data() {
		return {
			appTitle: "Grocery List Picker",
			baseUrl: baseProfilePicUrl,
			drawer: false,
			items: [
				{ title: "Lists", icon: "list", route: "/lists" },
				{ title: "My lists", icon: "list_alt", route: "/lists/mylists" },
				{ title: "My picks", icon: "save_alt", route: "/lists/mypicks" },
				{ title: "My history", icon: "receipt", route: "/lists/history" }
			],
			itemsAdmin: [
				{ title: "Dashboard", icon: "dashboard", route: "/admin" },
				{ title: "Stores", icon: "store", route: "/admin/stores" }
			],

			mini: false,
			right: null
		};
	},
	methods: {
		logout() {
			this.$store.dispatch("user/LOGOUT", this.$router);
		},
		signup() {
			this.$router.push("/signin");
		},
		login() {
			this.$router.push("/login");
		}
	}
};
</script>


<style scoped>
#logo {
	transform: rotate(-5deg);
	-webkit-transform: rotate(-5deg);
	-moz-transform: rotate(-5deg);
	-ms-transform: rotate(-5deg);
	-o-transform: rotate(-5deg);
	filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
	max-height: 40px;
}
.router-link-exact-active {
	text-decoration: none;
	color: white;
}
.router-link-active {
	text-decoration: none;
	color: white;
}
</style>