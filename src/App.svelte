<script>
  export let url = "";

  import { credentials } from './apiClient.js';
  import Login from "./Login.svelte";
  import AuthenticatedPanel from "./AuthenticatedPanel.svelte";

  let loggedIn;
  credentials.subscribe(creds => {
    loggedIn = creds.loggedIn;
  });

</script>

{#if loggedIn}
  <AuthenticatedPanel />
{:else }
  <Login />
{/if}
