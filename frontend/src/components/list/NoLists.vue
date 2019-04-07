<template>
	<v-container fluid>
		<v-layout row align-center fill-height>
			<v-flex xs12 text-xs-center>
				<h1 class="display-4">
					<v-icon size="150">mdi-bulletin-board</v-icon>
				</h1>
				<h2 class="display-3">Oops... Nothing here yet.</h2>
				<div v-if="$route.path === '/lists'">
					<h5 class="headline">Be the first to create a list.</h5>
					<h5 class="headline">
						Click
						<a @click="$router.push({name: 'newList'})">here</a>.
					</h5>
				</div>
				<div v-if="$route.name === 'myLists'">
					<h5 class="headline">Create your list and post it.</h5>
					<h5 class="headline">
						Click
						<a @click="$router.push({name: 'newList'})">here</a>.
					</h5>
				</div>
				<div v-if="$route.name === 'myPicks'">
					<h5 class="headline">You haven't picked any lists yet.</h5>
					<h5 class="headline">
						Click
						<a @click="$router.push('/lists')">here</a> to select one and start making money.
					</h5>
				</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	name: 'NoLists',
};
</script>

<style>
</style>
