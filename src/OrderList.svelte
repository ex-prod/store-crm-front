<script>
  import { currentUnitId } from "./stores.js";
  import { getOrders } from './apiClient.js';
  import { link } from "svelte-routing";
  let ordersPromise = null;

  currentUnitId.subscribe((unitId) => {
    if (unitId !== null) {
      ordersPromise = getOrders(unitId);
    }
  })

  let search = '';
  export let location;
</script>

<div>
  <div class="flex flex-wrap">
    <div class="w-full">
<div
  class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
>
  <div class="rounded-t mb-0 px-4 py-3 border-0">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 class="font-semibold text-base text-gray-800">
          Список заказов
        </h3>
      </div>
      <a href="/order-add" use:link>
        <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <button
            class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            Добавить заказ
          </button>
        </div>
      </a>
    </div>
  </div>
  <div class="block w-full overflow-x-auto">
    <!-- Projects table -->
    <table class="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th
            class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
          >
            Номер
          </th>
          <th
            class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
          >
            Клиент
          </th>
          <th
            class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
          >
            Позиций
          </th>
          <th
            class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
          >
            Сумма
          </th>
          <th
                  class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
          >
            Менеджер
          </th>
          <th
                  class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
          >
            Статус
          </th>
        </tr>
      </thead>
      <tbody>
      {#if ordersPromise !== null}
      {#await ordersPromise}
        <tr>
          <th colspan="6">
            Загрузка заказов...
          </th>
        </tr>
      {:then orders}
          {#each orders as order}
        <tr>
          <th
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left"
          >
            {order.id}
          </th>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
          >
            <a href="https://instagram.com/{order.customer.username}" target="_blank">@{order.customer.username}</a>
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
          >
            {order.positionsCount}
          </td>
          <td
            class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
          >
            {order.amount}
          </td>
          <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
          >
            {order.manager}
          </td>
          <td
                  class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4"
          >
            {order.state}
          </td>
        </tr>
          {/each}
      {/await}
        {:else }
        <tr>
          <th colspan="6">
            Ожидание...
          </th>
        </tr>
      {/if}
      </tbody>
    </table>
  </div>
</div>
    </div>
  </div>
</div>
