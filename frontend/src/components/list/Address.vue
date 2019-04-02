<template>
	<div>
		<h4 class="display-1 py-3">Address</h4>
		<v-divider class="pb-2"/>
		<v-layout row align-center wrap>
			<v-flex xs12 text-xs-left>
				<p class="caption">
					<v-icon small>mdi-road</v-icon>
					{{address.unit}} {{address.data.street}}
				</p>
				<p class="caption">{{address.data.postalCode}}</p>
				<p class="caption">
					<v-icon small>mdi-city</v-icon>
					{{address.data.city}} {{address.data.province}}
				</p>
				<p class="caption">
					<v-icon small>mdi-cellphone</v-icon>
					{{address.data.phoneNumber}}
				</p>
				<p class="caption">
					<v-icon small>mdi-email</v-icon>
					{{address.data.email}}
				</p>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { baseApiUrl } from "@/global";
export default {
	name: "Address",
	data() {
		return {
			address: {}
		};
	},
	computed: {
		...mapState({
			user: state => state.user,
			list: state => state.list
		})
	},
	methods: {
		async getAddress() {
			const url = `${baseApiUrl}/users/address/${this.list.list.id}`;

			this.address = await axios["get"](url);
		}
	},
	mounted() {
		this.getAddress();
	}
};
</script>

<style>
</style>
