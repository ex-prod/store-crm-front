<script>
    import UnitList from "./UnitList.svelte";
    import OrderList from "./OrderList.svelte";
    import VariantList from "./VariantList.svelte";
    import NewOrderForm from "./NewOrderForm.svelte";

    let currentUnitId;
    let positionItems = [];
</script>

<h3>Привет, user</h3>

<UnitList bind:currentUnitId={currentUnitId} />



{#if currentUnitId===undefined}
    Ожидание...
{:else}
    <OrderList currentUnitId={currentUnitId} />
    <VariantList currentUnitId={currentUnitId} bind:positionItems={positionItems} />
    <NewOrderForm bind:positionItems={positionItems} />
{/if}
