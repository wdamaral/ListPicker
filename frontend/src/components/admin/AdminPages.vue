<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="System admin"
            sub="Registration" />
        <div class="admin-pages-tabs">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Stores" active>
                        <StoreAdmin />
                    </b-tab>
                    <b-tab title="Users">
                        <UserAdmin />
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle'
import StoreAdmin from "./StoreAdmin"
import UserAdmin from "./UserAdmin"

export default {
    name: 'AdminPages',
    components: { PageTitle, StoreAdmin, UserAdmin }

}
</script>

<style>

</style>
