<script>
    import { currentUnitId } from "./stores.js";
    import { confirmOrder, cancelOrder } from './apiClient.js';
    import { link } from "svelte-routing";

    export let order;
    let orderConfirmationText;

    let selectedUnitId;
    currentUnitId.subscribe((unitId) => {
        selectedUnitId = unitId;
    });

    const generateText = function(o) {
        if (o.customer === undefined) {
            return "";
        }
        const positions = o.positions;
        console.log("confirmation text rendering", o);
        let positions_text = "";
        for (let n = 0; n < positions.length; n++) {
            let currentPositionText = (n+1) + ". " + positions[n].name + " Цена";
            const price = positions[n].price * (100 - positions[n].discount) / 100;
            if (positions[n].discount > 0) {
                currentPositionText += " (со скидкой " + positions[n].discount + "%)";
            }
            currentPositionText += ": " + price + " руб. ";
            currentPositionText += "Кол-во: " + positions[n].quantity + " шт. " + "Итого: " + price * positions[n].quantity +  "руб\n";
            positions_text += currentPositionText;
        }
        positions_text += "Итого сумма по товарам: " + o.amount + " руб.\n";

        let customer = o.customer;
        let delivery_type = "Непонятно";
        let delivery_address_type = "Адрес";
        if (o.deliveryType === "RUSSIAN_MAIL") {
            delivery_type = "Почта РФ";
        }
        if (o.deliveryType === "SDEK_STORAGE") {
            delivery_type = "СДЭК (до склада)";
            delivery_address_type = "Адрес склада СДЭК";
        }
        if (o.deliveryType === "SDEK_ADDRESS") {
            delivery_type = "СДЭК (курьер)";
        }
        let delivery_text = "Доставка: " + delivery_type + "\n";
        delivery_text += delivery_address_type + ": " + customer.zip + ", " + customer.city + ", " + customer.address + "\n";
        delivery_text += "Получатель: " + customer.name + ", " + customer.phone + "\n";

        let totalAmount = o.amount;
        delivery_text += "Стоимость доставки: ";
        if (o.deliveryIsPresent === true) {
            delivery_text += "бесплатно \n";
        } else {
            delivery_text += o.deliveryCost + " руб \n";
            totalAmount += o.deliveryCost;
        }

        let total_text = "\n";
        total_text += "Итоговая стоимость заказа: " + totalAmount + " руб\n";
        total_text += "Оплачено: " + o.paid + " руб\n";
        total_text += "К оплате: " + (totalAmount - o.paid) + " руб";


        return "Ваш заказ № " + o.id + ": \n"
            + positions_text
            + delivery_text
            + total_text;
    }

    $: orderConfirmationText = generateText(order);

    const cancelOrderButtonPressed = function() {
        const orderPromise = cancelOrder(selectedUnitId, order.id);
        orderPromise.then(o => {
           order = o;
        });
    };

    const confirmOrderButtonPressed = function() {
        const orderPromise = confirmOrder(selectedUnitId, order.id);
        orderPromise.then(o => {
           order = o;
        });
    };
</script>
<div class="rounded-t mb-0 px-4 py-3 border-0">
    {#if order.state === 'NEW'}
    <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 class="font-semibold text-base text-gray-800">
                Подтверждение заказа
            </h3>
        </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <p class="px-2 py-1 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full">
            Заказ создан в системе МойСклад. Все позиции заказа зарезервированы. Пожалуйста, проверьте всё ли правильно и подтвердите (либо отмените) заказ.
        </p>
        <pre class="px-2 py-1 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full">
            {orderConfirmationText}
        </pre>
    </div>
    <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="text-center flex justify-between">
            <button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button" on:click={cancelOrderButtonPressed}>Отменить
            </button>
            <button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    type="button" on:click={confirmOrderButtonPressed}>Подтвердить
            </button>
        </div>
    </div>
    {/if}
    {#if order.state === 'CONFIRMED'}
        <div class="flex flex-wrap items-center">
            <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 class="font-semibold text-base text-gray-800">
                    Заказ создан
                </h3>
            </div>
        </div>
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <a href="/" use:link class="px-2 py-1 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full">
                К списку
            </a>
        </div>
    {/if}

</div>
