<template>
    <div class="row q-pa-md q-col-gutter-md">
        <div class="col">
            <q-card flat>
                <q-card-section>
                    <div class="text-body1 text-bold q-mb-sm">Detail Mobil</div>
                    <div class="row items-center">
                        <div class="column">
                            <div class="text-body1">{{ order?.car?.brand }}</div>
                            <div class="text-body1">{{ order?.car?.vehicle_no }}</div>
                        </div>
                        <q-space />
                        <div class="column q-mr-md">
                            <div class="text-body1">{{ order?.car?.provider?.trading_name }}</div>
                            <div class="row q-gutter-xl">
                                <div class="row items-center text-blue-grey-4">
                                    <q-icon :name="ionLocation" class="q-mr-sm" />
                                    {{ order?.car?.provider?.city }}, {{
                                        order?.car?.provider?.province }}
                                </div>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <RentDetailsCardSec :editable="false" :rentDetails="rentDetails" />

                <BillingSumCardSec v-if="rentDetails != undefined" :startDate="rentDetails?.startDate"
                    :endDate="rentDetails?.endDate" :price="order?.car?.price"
                    :deposit="order?.car?.deposit == undefined ? 0 : order?.car.deposit" />
            </q-card>
        </div>
        <div class="col-6">
            <div id="snap-container" style="width: 100%;"></div>
            <!-- <PaymentVaCard v-if="order != undefined && order.payments[0].payment_method == 'Virtual Account'"
                :order="order" /> -->

        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { QSpinnerGears, useQuasar } from 'quasar';
import CryptoService from '@/services/crypto.service';
import OrderService from '@/services/order.service';
import { formatTimestampToDate, formatTimestampToTime } from '@/composables/formatter';
import RentDetailsCardSec from '@/components/cards/RentDetailsCardSec.vue';
import BillingSumCardSec from '@/components/cards/BillingSumCardSec.vue';
import type { RentDetails } from '@/interfaces/RentDetails';
import { ionLocation } from '@quasar/extras/ionicons-v6';
import type { Order } from '@/interfaces/rest/Order';

const route = useRoute();
const quasar = useQuasar();
const order = ref<Order>();
const rentDetails = ref<RentDetails>();
const token = ref<string>();
declare let snap: any;

function getOrderDetails(orderId: number) {
    quasar.loading.show({ spinner: QSpinnerGears });
    OrderService.get(orderId).then((response) => {
        // console.log(response.data);
        quasar.loading.hide();
        order.value = response.data;
        token.value = order.value?.payments[0].token;
        console.log('token get', token.value);

        snap.embed(token.value, {
            embedId: 'snap-container'
        });

        rentDetails.value = {
            city: '',
            province: '',
            pickupAddress: order.value?.pickup_location!,
            returnAddress: order.value?.return_location!,
            startDate: formatTimestampToDate(order.value?.start_datetime),
            startTime: formatTimestampToTime(order.value?.start_datetime),
            endDate: formatTimestampToDate(order.value?.end_datetime),
            endTime: formatTimestampToTime(order.value?.end_datetime),
        }
    }).catch((error) => {
        console.log(error);
        quasar.loading.hide();
    });
}

onBeforeMount(() => {
    const orderId = route.query.oid;
    // console.log(orderId);
    if (typeof orderId === 'string') {
        getOrderDetails(parseInt(CryptoService.decrypt(orderId)));
    }
});
</script>
