<script>
    export let currentUnitId;
    export let positionItems;
    import { getVariants } from './apiClient.js';
    let variantsPromise = getVariants(currentUnitId);

    let search = '';

    function searchVariantsEvent(event) {
        console.log(event);
        searchVariants(search)
    }

    function searchVariants(searchString) {
        if (searchString.length < 3 && searchString.length !== 0) {
            return;
        }
        console.log(searchString);
        variantsPromise = getVariants(currentUnitId, searchString)
    }

    function selectItem(event) {
        let id = event.target.getAttribute("value");
        console.log("selected id: " + id);
        positionItems.push({id: id, quantity: 1, discount: 0});
        console.log(positionItems);
        positionItems = positionItems;
    }
</script>
<h3>Товары:</h3>
<input type="text" bind:value={search} on:keyup={searchVariantsEvent} />
{#await variantsPromise}
{:then variants}
    <ul>
        {#each variants as variant}
            <li value="{variant.id}" on:click={selectItem}>
                {#if variant.images[0] !== undefined}
                    <img src={variant.images[0].thumbnail} alt={variant.name}/>{variant.name}
                    {:else}
                    {variant.name}
                    {/if}
            </li>
        {/each}
    </ul>
{/await}
