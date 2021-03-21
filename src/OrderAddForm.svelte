<script>
  import { currentUnitId } from "./stores.js";
  import { link } from "svelte-routing";

  import { getVariants, createOrder } from './apiClient.js';

  import OrderConfirmForm from './OrderConfirmForm.svelte';

  let variantsPromise;
  let selectedUnitId;
  let search = '';
  let positionItems = [];
  let loadedVariants = [];
  let totalAmount = 0;
  let totalCount = 0;
  let totalPositions = 0;
  let remoteCreatedOrder = {
    state: undefined
  };
  let orderData = {
    comment: "",
    prepaidType: "PARTIAL",
    deliveryType: "SDEK_ADDRESS",
    deliveryCost: 0,
    customerName: "",
    customerUsername: "",
    phone: "",
    city: "",
    zip: "",
    address: "",
    deliveryIsPresent: false
  }

  function createOrderButtonPressed() {
    console.log(orderData);
    const positions = [];
    for (let pos in positionItems) {
      const pp = positionItems[pos];
      console.log(pp);
      positions.push({
        variantId: pp.id,
        quantity: pp.quantity,
        price: pp.price,
        discount: pp.discount
      });
    }
    const data = {
      description: orderData.comment,
      customer: {
        name: orderData.customerName,
        username: orderData.customerUsername,
        phone: orderData.phone,
        city: orderData.city,
        zip: orderData.zip,
        address: orderData.deliveryType === "SDEK_ADDRESS" ? orderData.address : "",
        sdekAddress: orderData.deliveryType === "SDEK_STORAGE" ? orderData.address : ""
      },
      prepaidType: orderData.prepaidType,
      deliveryCost: orderData.deliveryCost,
      deliveryType: orderData.deliveryType,
      deliveryIsPresent: orderData.deliveryIsPresent,
      positions: positions
    }
    console.log(data);
    const createdOrder = createOrder(selectedUnitId, data);
    console.log(createdOrder);
    createdOrder.then(order => {
        console.log(order);
        remoteCreatedOrder = order;
    });
  }

  currentUnitId.subscribe((unitId) => {
    selectedUnitId = unitId;
    if (unitId !== null) {
      variantsPromise = getVariants(selectedUnitId);
    }
    loadedVariants = [];
    positionItems = [];
    search = "";
    recalculate();
  });

  function searchVariantsEvent(event) {
    console.log(event);
    searchVariants(search)
  }

  function searchVariants(searchString) {
    if (searchString.length < 3) {
      loadedVariants = [];
      return;
    }
    console.log(searchString);
    variantsPromise = getVariants(selectedUnitId, searchString)
    variantsPromise.then((result) => {
      console.log(result);
      loadedVariants = result;
    });
  }

  function selectItem(event) {
    let id = event.target.getAttribute("value");
    console.log("selected id: " + id);
    for (const pos in loadedVariants) {
      const variant = loadedVariants[pos];
      if (id == variant.id) {
        positionItems.push({
          id: variant.id,
          name: variant.name,
          quantity: 1,
          discount: 0,
          price: variant.price,
          amount: variant.price
        });
        recalculate();
      }
    }
    search = "";
    loadedVariants = [];
  }

  function recalculate() {
    let sum = 0;
    let count = 0;
    for (const pos in positionItems) {
      const position = positionItems[pos];
      position.amount = position.price * position.quantity * (100 - position.discount) / 100;
      sum += position.amount;
      count += position.quantity;
    }
    totalAmount = sum;
    totalCount = count;
    totalPositions = positionItems.length;
    positionItems = positionItems;
  }

</script>

<div>
  <div class="flex flex-wrap">
    <div class="w-full">
      <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div class="rounded-t mb-0 px-4 py-3 border-0">
          <div class="flex flex-wrap items-center">
            <div class="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 class="font-semibold text-base text-gray-800">
                Добавить заказ
              </h3>
            </div>
            <a href="/" use:link>
              <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button
                  class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  Отмена
                </button>
              </div>
            </a>
          </div>
          <div class="mb-3 pt-0">
            <input type="text" bind:value={search} on:keyup={searchVariantsEvent}  placeholder="Поиск позиции (от 3х символов)" class="px-2 py-1 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
          </div>
            <ul>
              {#each loadedVariants as variant}
                <li value="{variant.id}" on:click={selectItem}>
                  {#if variant.images[0] !== undefined}
                    <img src={variant.images[0].thumbnail} alt={variant.name}/>{variant.name}
                  {:else}
                    {variant.name}
                  {/if}
                </li>
              {/each}
            </ul>
        </div>
        <div class="block w-full overflow-x-auto">
          <!-- Projects table -->
          <table class="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Название
                </th>
                <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Цена
                </th>
                <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Количество
                </th>
                <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Скидка
                </th>
                <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                  Сумма
                </th>
              </tr>
            </thead>
            <tbody>
                {#each positionItems as item}
              <tr>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.name}
                </td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.price}
                </td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <input type="number" bind:value={item.quantity} on:change={recalculate} placeholder="Small Input" class="px-2 py-1 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
                </td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  <input type="number" bind:value={item.discount} on:change={recalculate} placeholder="Small Input" class="px-2 py-1 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
                </td>
                <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                  {item.amount}
                </td>
              </tr>
                {/each}
            </tbody>
            <tfoot>
            <tr>
              <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                Позиций: {totalPositions}
              </th>
              <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
              </th>
              <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                {totalCount}
              </th>
              <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
              </th>
              <th class="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                {totalAmount}
              </th>
            </tr>
            </tfoot>
          </table>
        </div>
        <div class="rounded-t mb-0 px-4 py-3 border-0">
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form>
              <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">Клиент</h6>
              <div class="flex flex-wrap">
                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-name">ФИО</label>
                    <input id="grid-name" type="text" placeholder="Джесси Пинкман"
                           class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                           bind:value={orderData.customerName}></div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-nickname">Никнейм</label>
                    <input id="grid-nickname" type="text" placeholder="@JessieBruceMeth"
                           class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                           bind:value={orderData.customerUsername}></div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-phone">Телефон</label>
                    <input id="grid-phone" type="text" placeholder="79197663214"
                           class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                           bind:value={orderData.phone}></div>
                </div>
              </div>
              <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">Доставка</h6>
              <div class="flex flex-wrap">
                <div class="w-full lg:w-3/12 px-4 mb-3">
                  <input id="grid-delivery-type-mail-rf" type="radio"
                         class="relative px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline ease-linear transition-all duration-150"
                         value="RUSSIAN_MAIL" bind:group={orderData.deliveryType} >
                  <label class="relative uppercase text-gray-700 text-xs font-bold mb-2" for="grid-delivery-type-mail-rf">
                    Почта РФ
                  </label>
                  <br />
                  <input id="grid-delivery-type-storage" type="radio"
                         class="relative px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline ease-linear transition-all duration-150"
                         value="SDEK_STORAGE" bind:group={orderData.deliveryType} >
                  <label class="relative uppercase text-gray-700 text-xs font-bold mb-2" for="grid-delivery-type-storage">
                    СДЭК до склада
                  </label>
                  <br />
                  <input id="grid-delivery-type-address" type="radio"
                         class="relative px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline ease-linear transition-all duration-150"
                         value="SDEK_ADDRESS" bind:group={orderData.deliveryType}>
                  <label class="relative uppercase text-gray-700 text-xs font-bold mb-2" for="grid-delivery-type-address">
                    СДЭК до двери
                  </label>
                </div>

                <div class="w-full lg:w-9/12 px-4 mb-3">
                  <input id="grid-delivery-present" type="checkbox"
                         class="relative px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline ease-linear transition-all duration-150"
                         bind:checked={orderData.deliveryIsPresent}>
                  <label class="relative uppercase text-gray-700 text-xs font-bold mb-2" for="grid-delivery-present">
                    Доставка за наш счет
                  </label>
                </div>

                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-postal-code">Индекс</label>
                    <input id="grid-postal-code" type="text" placeholder="127273"
                           class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                           bind:value={orderData.zip}>
                  </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-city">Город</label>
                    <input id="grid-city" type="email" placeholder="Альбукерке"
                           class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                           bind:value={orderData.city}></div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-delivery-cost">Стоимость доставки</label>
                    <input id="grid-delivery-cost" type="email" placeholder="400"
                           class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                           bind:value={orderData.deliveryCost} ></div>
                </div>
                <div class="w-full lg:w-12/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-address">Адрес</label>
                    <input id="grid-address" type="text" placeholder="Першинг Авеню СЕ, дом 87108"
                           class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                           bind:value={orderData.address}></div>
                </div>
              </div>
              <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">Предоплата</h6>
              <div class="flex flex-wrap">
                <div class="w-full lg:w-3/12 px-4">
                    <input id="grid-prepay-500" type="radio" name="grid-prepay"
                           class="relative px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline ease-linear transition-all duration-150"
                           value="PARTIAL" bind:group={orderData.prepaidType}>
                  <label class="relative uppercase text-gray-700 text-xs font-bold mb-2" for="grid-prepay-500">
                    500 руб
                  </label>
                </div>
                <div class="w-full lg:w-3/12 px-4">
                    <input id="grid-prepay-full" type="radio" name="grid-prepay"
                           class="relative px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline ease-linear transition-all duration-150"
                           value="FULL" bind:group={orderData.prepaidType}>
                  <label class="relative uppercase text-gray-700 text-xs font-bold mb-2" for="grid-prepay-full">
                    Полная
                  </label>
                </div>

              </div>
              <h6 class="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">Другое</h6>
              <div class="flex flex-wrap">
                <div class="w-full lg:w-12/12 px-4">
                  <div class="relative w-full mb-3"><label class="block uppercase text-gray-700 text-xs font-bold mb-2"
                                                           for="grid-comment">Комментарий</label>
                    <textarea id="grid-comment" type="text" placeholder="Хочет доставку 5го марта"
                              class="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                              rows="4" bind:value={orderData.comment}></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {#if remoteCreatedOrder.state !== 'NEW' && remoteCreatedOrder.state !== 'CONFIRMED'}
          <div class="rounded-t bg-white mb-0 px-6 py-6">
            <div class="text-center flex justify-between">
              <button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button" on:click={createOrderButtonPressed}>Создать заказ
              </button>
            </div>
          </div>
          {/if}

        </div>
        <div>
          <OrderConfirmForm bind:order={remoteCreatedOrder} />
        </div>
      </div>
    </div>
  </div>
</div>
