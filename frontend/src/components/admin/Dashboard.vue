<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="dashboard"
            sub="Dashboard" />
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
import StoreAdmin from "./StoreAdmin"
import UserAdmin from "./UserAdmin"

export default {
    name: 'Dashboard',
    components: { StoreAdmin, UserAdmin }

}
</script>

<style>
    .admin-pages {
        margin-left: 50px;
        margin-right: 50px;
    }
</style>
