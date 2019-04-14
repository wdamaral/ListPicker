<template>
	<div class="admin-pages">
		<h4 class="display-1 red--text">
			<v-icon large color="red" v-if="icon">{{icon}}</v-icon>
			{{ main }}
		</h4>
		<v-divider class="pb-4"/>
	</div>
</template>

<script>
export default {
	name: 'PageTitle',
	props: ['icon', 'main'],
};
</script>

<style>
</style>
