<script>
    import {getUnits} from './apiClient.js';
    const unitsPromise = getUnits();

    import {currentUnitId, currentUnitName} from "./stores";

    let selectedUnitId;
    let units;

    function updateSelected() {
        currentUnitId.set(selectedUnitId);
        for (const counter in units) {
            console.log(units[counter]);
            if (units[counter].id == selectedUnitId) {
                currentUnitName.set(units[counter].alias);
            }
        }
    }

    unitsPromise.then((unitsLoaded) => {
            units = unitsLoaded;
            selectedUnitId = units[0].id;
            updateSelected();
        }
    );


</script>
{#await unitsPromise}
    <p class="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10">loading...</p>
{:then units}
    <select bind:value={selectedUnitId} on:change={updateSelected}
            class="px-3 py-3 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10">
        {#each units as {id, alias}, i}
            <option value="{id}">
                {alias}
            </option>
        {/each}
    </select>
{/await}
