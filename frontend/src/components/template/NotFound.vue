<template>
	<v-container fluid>
		<v-layout row align-center fill-height>
			<v-flex xs12 text-xs-center>
				<h1 class="display-4">
					<v-icon size="150">mdi-emoticon-sad-outline</v-icon>
				</h1>
				<h2 class="display-3">404</h2>
				<h2 class="display-3">Page not found.</h2>
				<h5 class="headline">The page you're looking for does not exist or other error ocurred</h5>
				<h5 class="headline">
					Go
					<a @click="$router.go(-1)">back</a> or head over to
					<router-link to="/">home</router-link>.
				</h5>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {};
</script>

<style>
</style>
