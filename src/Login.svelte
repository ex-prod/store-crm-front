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

<div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
        <div class="w-full lg:w-4/12 px-4">
            <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"
            >
                <div class="rounded-t mb-0 px-6 py-6">
                    <hr class="mt-6 border-b-1 border-gray-400" />
                </div>
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                    <div class="text-gray-500 text-center mb-3 font-bold">
                        <small>
                            {#await checking}
                                Проверка...
                            {:then result}
                                Авторизация
                            {/await}
                        </small>

                    </div>

                    <form>
                        <div class="relative w-full mb-3">
                            <label
                                    class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                    for="grid-email"
                            >
                                Email
                            </label>
                            <input
                                    id="grid-email"
                                    type="text"
                                    class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                    placeholder="Email"
                                    bind:value={user}
                            />
                        </div>

                        <div class="relative w-full mb-3">
                            <label
                                    class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                    for="grid-password"
                            >
                                Password
                            </label>
                            <input
                                    id="grid-password"
                                    type="password"
                                    class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                                    placeholder="Password"
                                    bind:value={password}
                            />
                        </div>
                        <!--            <div>-->
                        <!--              <label class="inline-flex items-center cursor-pointer">-->
                        <!--                <input-->
                        <!--                  id="customCheckLogin"-->
                        <!--                  type="checkbox"-->
                        <!--                  class="form-checkbox text-gray-800 ml-1 w-5 h-5 ease-linear transition-all duration-150"-->
                        <!--                />-->
                        <!--                <span class="ml-2 text-sm font-semibold text-gray-700">-->
                        <!--                  Remember me-->
                        <!--                </span>-->
                        <!--              </label>-->
                        <!--            </div>-->

                        <div class="text-center mt-6">
                            <button
                                    class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                    type="button"
                                    on:click={tryLogin}
                            >
                                Вход
                            </button>
                            {#await checking}
                            {:then result}
                                {errorText}
                            {/await}

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
