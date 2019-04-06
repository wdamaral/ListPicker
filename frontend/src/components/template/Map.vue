<template>
	<v-card elevation-3>
		<GmapMap
			ref="mapRef"
			v-bind:center="{lat: latitude, lng: longitude}"
			style="max-width: 100%; height: 300px;"
			:zoom="16"
			:radius="10"
			:options="mapOptions"
		>
			<gmap-circle
				:radius="120"
				:options="mapCenterOptions"
				v-bind:center="{lat: latitude, lng: longitude}"
			/>
		</GmapMap>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'Map',
	props: ['latitude', 'longitude'],
	data() {
		return {
			mapCenterOptions: {
				strokeColor: '#FF0000',
				strokeOpacity: 0.1,
				strokeWeight: 1,
				fillColor: '#FF0000',
				fillOpacity: 0.1,
			},
			mapOptions: {
				zoomControl: true,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: true,
				rotateControl: false,
				fullscreenControl: true,
				disableDefaultUi: false,
				dragable: false,
			},
		};
	},
	computed: {
		...mapState({ user: state => state.user }),
	},
};
</script>

<style>
</style>
