<template>
	<div class="admin-home">
		<router-view></router-view>
	</div>
</template>

<script>
import Menu from './Menu';
export default {
	name: 'AdminHome',
	components: { Menu },
};
</script>

<style>
</style>
