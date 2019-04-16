<template>
	<v-container>
		<v-layout row justify-space-between wrap pa-3>
			<v-flex xs12 md10 offset-md1>
				<v-card class="card--flex-toolbar">
					<v-toolbar card prominent class="red lighten-3 elevation-1">
						<p class="headline pl-4">Store administration</p>
						<v-spacer/>
					</v-toolbar>

					<v-card-text>
						<v-input type="hidden" v-model="editedItem.id"/>
						<v-form ref="form" v-model="valid" lazy-validation>
							<v-layout row align-center wrap>
								<v-flex order-xs2 order-md1>
									<v-layout row wrap justify-space-between pb-4>
										<v-flex xs12 pa-1>
											<v-text-field
												v-model="editedItem.name"
												:disabled="mode === 'remove'"
												hint="Name of the store"
												label="Store name"
												:rules="[rules.required, rules.max]"
												validate-on-blur
												required
											/>
										</v-flex>
										<v-flex xs12 pa-1>
											<v-text-field
												:disabled="mode === 'remove'"
												v-model="editedItem.description"
												hint="Sometimes, a small description helps"
												label="Description"
												:rules="[rules.max]"
												validate-on-blur
												required
											/>
										</v-flex>
									</v-layout>
								</v-flex>
								<v-flex text-xs-center order-xs1 order-md2 xs6 offset-xs3 offset-sm0 md4 pa-1>
									<v-tooltip bottom>
										<template v-slot:activator="{ on }">
											<v-img
												v-if="editedItem.imageUrl && uploads === 0"
												:src="imageUrl + editedItem.imageUrl"
												@click="pickFile"
												class="imageUpload"
												v-bind:class="editedItem.id ? 'cursor' : ''"
											/>
											<v-img
												v-else-if="editedItem.imageUrl && uploads > 0"
												:src="tempImgUrl + editedItem.imageUrl"
												class="imageUpload"
												@click="pickFile"
												v-bind:class="editedItem.id ? 'cursor' : ''"
											/>
											<v-img
												class="cursor"
												v-on="on"
												v-else
												:src="imageUrl + 'noimage.png'"
												@click="pickFile"
											/>

											<input
												:disabled="mode === 'remove'"
												type="file"
												style="display: none"
												ref="image"
												accept="image/jpeg, image/jpg image/png, image/gif, image/png"
												@change="upload($event)"
											>
										</template>
										<span>Upload new logo</span>
									</v-tooltip>
								</v-flex>
							</v-layout>
							<div class="body-2 pb-2">Registered stores</div>
							<v-divider class="py-2"/>
							<div>
								<v-flex xs12 text-xs-right pb-2>
									<v-btn v-if="mode === 'remove'" @click="remove" round color="red lighten-2">
										<v-icon>delete</v-icon>Remove
									</v-btn>
									<v-btn
										v-if="mode == 'save'"
										@click="save"
										:disabled="!valid"
										round
										color="green lighten-2"
									>
										<v-icon>save</v-icon>Save
									</v-btn>
									<v-btn @click="reset" round color="blue lighten-2">
										<v-icon>cancel</v-icon>Cancel
									</v-btn>
								</v-flex>
								<v-data-table
									:headers="headers"
									:items="store.stores.stores"
									:pagination.sync="pagination"
									class="elevation-1"
								>
									<template v-slot:items="props">
										<td class="text-xs-left">{{ props.item.id }}</td>
										<td class="text-xs-left">{{ props.item.name }}</td>
										<td class="text-xs-left">{{ props.item.description }}</td>
										<td class="text-xs-left">
											<v-img :src="imageUrl + props.item.imageUrl" max-width="100" max-height="50"></v-img>
										</td>
										<td class="justify-center layout px-0">
											<v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
											<v-icon small color="red" @click="deleteItem(props.item)">delete</v-icon>
										</td>
									</template>
									<template v-slot:no-data>
										<v-flex xs12 d-flex grow>No stores registered.</v-flex>
									</template>
								</v-data-table>
							</div>
						</v-form>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { mapState } from 'vuex';
import { baseStoreImgUrl, baseTempImgUrl } from '@/global';
export default {
	name: 'StoreAdmin',
	data: () => ({
		mode: 'save',
		uploads: 0,
		pagination: {},
		imageUrl: baseStoreImgUrl,
		tempImgUrl: baseTempImgUrl,
		valid: false,
		rules: {
			required: v => !!v || 'Store name is required.',
			max: v => (v && v.length <= 50) || 'Max 50 characters',
		},
		headers: [
			{ text: '#', sortable: false, value: 'id' },
			{
				text: 'Store name',
				align: 'left',
				value: 'name',
			},
			{ text: 'Description', value: 'description' },
			{ text: 'Logo', value: 'imageUrl', sortable: false },
			{ text: 'Actions', value: 'id', sortable: false },
		],
		editedItem: {
			name: '',
			description: '',
		},
		editedPicture: '',
	}),

	computed: {
		//It maps the state of the Vue store
		...mapState({
			store: state => state.store,
		}),

		getPagination: () => {
			let _pagination = this.$store.getters['store/GET_PAGINATION'];
			this.pagination.rowsPerPage = _pagination.pageSize;
			this.pagination.page = _pagination.page;
			this.pagination.totalItems = _pagination.rowCount;
		},
	},
	//called when the the page is mounted
	mounted() {
		this.getStores();
	},

	methods: {
		//gets All stores
		async getStores() {
			await this.$store.dispatch('store/GET_STORES');
		},
		//Selects the store to edit
		editItem(item) {
			this.editedItem = Object.assign({}, item);
			this.mode = 'save';
		},
		//Selects the store to delete
		deleteItem(item) {
			this.editedItem = Object.assign({}, item);
			this.mode = 'remove';
		},
		//Deletes the store that is selected
		async remove() {
			this.$refs.form.resetValidation();
			await this.$store.dispatch('store/REMOVE', this.editedItem);
			this.reset();
		},
		//Resets all fields
		reset() {
			this.mode = 'save';
			this.editedItem = {
				name: '',
				description: '',
			};
			const input = this.$refs.image;
			input.type = 'text';
			input.type = 'file';
			this.$refs.form.resetValidation();
			this.uploads = 0;
			//this.getStores();
		},
		//Saves the edited/new item to the database through the Vuex
		save() {
			if (this.$refs.form.validate()) {
				this.$store.dispatch('store/SAVE', {
					store: this.editedItem,
					uploads: this.uploads,
				});
				this.reset();
			}
		},
		//Opens the system browser to select an image to upload
		pickFile() {
			this.$refs.image.click();
		},
		//Uploads the selected picture through the Vuex
		async upload(event) {
			let imageUrl = await this.$store.dispatch('UPLOAD', event);

			if (imageUrl && this.editedPicture === '') {
				this.uploads++;
				this.editedPicture = this.editedItem.imageUrl;
				this.editedItem.imageUrl = imageUrl;
			} else if (imageUrl) {
				this.uploads++;
				this.editedItem.imageUrl = imageUrl;
			}
			this.$forceUpdate();
		},
	},
};
</script>

<style scoped>
.cursor {
	cursor: pointer;
}
.imageUpload {
	max-width: 150px;
	max-height: 70px;
}
</style>
