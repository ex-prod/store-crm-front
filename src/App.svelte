<script>
    import { credentials } from './apiClient.js';
    import Login from "./Login.svelte";
    import AuthenticatedPanel from "./AuthenticatedPanel.svelte";

    let loggedIn;
    credentials.subscribe(creds => {
        loggedIn = creds.loggedIn;
    });

</script>

<h2>Панель управления магазином</h2>

{#if loggedIn}
    <AuthenticatedPanel />
{:else }
    <Login />
{/if}
