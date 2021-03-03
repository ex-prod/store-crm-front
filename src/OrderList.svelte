<script>
    export let currentUnitId;
    import { getOrders } from './apiClient.js';
    let ordersPromise = getOrders(currentUnitId);

    let search = '';
</script>
<h3>Заказы:</h3>
<form>
    {#await ordersPromise}
        <p>Загрузка заказов...</p>
    {:then orders}
        <ul>
            {#each orders as order}
                <li value="{order.id}">
                    {order.id} - {order.manager} - {order.state} - {order.positionsCount}
                </li>
            {/each}
        </ul>
    {/await}
</form>
