<script>
    import { Router, Route } from "svelte-routing";
    import { currentUnitId, currentUnitName } from "./stores";

    import UnitList from "./UnitList.svelte";
    import VariantList from "./VariantList.svelte";

    // components for this layout
    import AdminNavbar from "./AdminNavbar.svelte";
    import Sidebar from "components/Sidebar/Sidebar.svelte";
    import HeaderStats from "components/Headers/HeaderStats.svelte";
    import FooterAdmin from "components/Footers/FooterAdmin.svelte";

    // pages for this layout
    import OrderList from "./OrderList.svelte";
    import OrderAddForm from "./OrderAddForm.svelte";
    import OrderConfirmForm from "./OrderConfirmForm.svelte";
    import Settings from "views/admin/Settings.svelte";
    import Tables from "views/admin/Tables.svelte";
    import Maps from "views/admin/Maps.svelte";

    let selectedUnitId;
    let selectedUnitName;
    currentUnitId.subscribe(unitId => {
        selectedUnitId = unitId;
    });
    currentUnitName.subscribe(unitName => {
        selectedUnitName = unitName;
    });
    let positionItems = [];
</script>


<div>
<!--    <Sidebar location={location}/>-->
<!--    <div class="relative md:ml-64 bg-gray-200">-->
    <div class="relative bg-gray-200">
        <AdminNavbar currentUnitName={selectedUnitName}/>
        <HeaderStats />
        <div class="px-4 md:px-10 mx-auto w-full -m-24">
            <Router url="admin">
                <Route path="" component="{OrderList}" />
                <Route path="/order-add" component="{OrderAddForm}" />
<!--                <Route path="settings" component="{Settings}" />-->
<!--                <Route path="tables" component="{Tables}" />-->
<!--                <Route path="maps" component="{Maps}" />-->
            </Router>
            <FooterAdmin />
        </div>
    </div>
</div>

<!--<OrderList currentUnitId={currentUnitId} />-->
<!--<VariantList currentUnitId={currentUnitId} bind:positionItems={positionItems} />-->
