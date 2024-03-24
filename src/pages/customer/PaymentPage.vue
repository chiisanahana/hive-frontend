<template>
    <div class="row q-pa-md q-gutter-md">
        <div class="col">
            <q-card flat>
                <q-card-section>
                    <div class="text-body1 text-bold q-mb-sm">Car Details</div>
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

                <BillingSumCardSec :startDate="formatTimestampToDateDisplay(order?.start_datetime!)"
                    :endDate="formatTimestampToDateDisplay(order?.end_datetime!)" :price="order?.car?.price"
                    :deposit="order?.car?.deposit" />
            </q-card>
        </div>
        <div class="col-7">
            <q-card flat>
                <q-card-section>
                    <img :src="order?.payments[0].payment_method == 'Virtual Account' ? va : cc"
                        class="payment-method" />
                    <div class="text-h6 text-center text-positive">Please finish your payment</div>

                    <q-card-actions align="right" class="q-mt-xl">
                        <q-btn unelevated color="secondary" text-color="accent" label="Explore cars" to="cars" />
                        <q-btn color="primary" label="View history" style="min-width: 140px;" to="history" />
                    </q-card-actions>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { QSpinnerGears, useQuasar } from 'quasar';
import CryptoService from '@/services/crypto.service';
import OrderService from '@/services/order.service';
import { formatTimestampToDate, formatTimestampToTime, formatTimestampToDateDisplay } from '@/composables/formatter';
import RentDetailsCardSec from '@/components/cards/RentDetailsCardSec.vue';
import BillingSumCardSec from '@/components/cards/BillingSumCardSec.vue';
import type { RentDetails } from '@/interfaces/RentDetails';
import { ionLocation } from '@quasar/extras/ionicons-v6';
import va from '@/assets/images/va.png';
import cc from '@/assets/images/cc.png';
import type { Order } from '@/interfaces/rest/Order';

const route = useRoute();
const quasar = useQuasar();
const order = ref<Order>();
const rentDetails = ref<RentDetails>();

function getOrderDetails(orderId: number) {
    quasar.loading.show({ spinner: QSpinnerGears });
    OrderService.get(orderId).then((response) => {
        // console.log(response.data);
        quasar.loading.hide();
        order.value = response.data;

        rentDetails.value = {
            location: '',
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

<style scoped>
.payment-method {
    width: 48px;
}
</style>