<script>
    export let positionItems;

    let search = '';
</script>
<h3>Новый заказ:</h3>
<ul>
    {#each positionItems as position}
        <li value="{position.id}">
            <p>{position.id} - {position.name} - {position.price}</p>
            <span>
                <input type="number" bind:value={position.quantity} min="0" />
                <button class="number" on:click={() => position.quantity -= 1}>-</button>
                <button class="number" on:click={() => position.quantity += 1}>+</button>
            </span>

            <span>
            <input type="number" bind:value={position.discount} min="0" max="100"/>
                <button class="number" on:click={() => position.discount -= 1}>-</button>
                <button class="number" on:click={() => position.discount += 1}>+</button>
            </span>
        </li>
    {/each}
</ul>
