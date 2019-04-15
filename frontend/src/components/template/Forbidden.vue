<template>
	<v-container fluid>
		<v-layout row align-center fill-height>
			<v-flex xs12 text-xs-center>
				<h1 class="display-4">
					<v-icon size="150">mdi-shield-lock-outline</v-icon>
				</h1>
				<h2 class="display-3">403</h2>
				<h2 class="display-3">Forbidden.</h2>
				<h5 class="headline">You cannot access this page.</h5>
				<h5 class="headline">
					Go
					<a @click="$router.go(-1)">back</a>.
				</h5>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	name: 'Forbidden',
};
</script>

<style>
</style>
