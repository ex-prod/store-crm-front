<script>
    import {checkLogin} from "./apiClient.js";
    let user = "";
    let password = "";

    let checking;
    let errorText = "";

    function tryLogin() {
        checking = checkLogin(user, password);
        checking.then(() => {
            errorText = "Введены неверные учетные данные";
        })

    }

</script>

<h3>
{#await checking}
    Проверка...
{:then result}
    Авторизация
{/await}
</h3>
    <input name="user" type="text" bind:value={user} placeholder="email"/>
    <input name="password" type="password" bind:value={password} placeholder="password" />
    <button on:click={tryLogin}>Войти</button>
{#await checking}
{:then result}
    {errorText}
{/await}

