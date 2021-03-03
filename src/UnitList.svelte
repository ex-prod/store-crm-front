<script>
    export let currentUnitId;
    import {getUnits} from './apiClient.js';
    const unitsPromise = getUnits();

</script>
<h3>юнит</h3>
<form>
    {#await unitsPromise}
        <p>loading</p>
    {:then units}
        <select bind:value={currentUnitId}>
            {#each units as {id, alias}, i}
                <option value="{id}">
                    {alias}
                </option>
            {/each}
        </select>
    {/await}
</form>
