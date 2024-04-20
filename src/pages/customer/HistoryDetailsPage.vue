<template>
    <div class="row q-pa-md q-col-gutter-md">
        <div class="col-xs-12 col-sm">
            <q-card flat>
                <q-card-section>
                    <div class="text-body1 text-bold q-mb-sm">Detail Mobil</div>
                    <div class="row" v-if="order?.car && order?.car.provider">
                        <div class="column">
                            <div class="text-body1">{{ order?.car.brand }}</div>
                            <div class="text-body1">{{ order?.car.vehicle_no }}</div>
                        </div>
                        <q-space />
                        <div class="column q-mr-md">
                            <div class="text-body1">{{ order?.car.provider?.trading_name }}</div>
                            <div class="column">
                                <div class="row items-center text-blue-grey-4">
                                    <q-icon :name="ionLocation" class="q-mr-sm" />
                                    {{ order?.car.provider.address }}
                                </div>
                                <div class="row items-center text-blue-grey-4 q-ml-lg">
                                    {{ order?.car.provider.city }}, {{ order?.car.provider.province }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-else>
                        <div class="column">
                            <q-skeleton type="text" width="100px" />
                            <q-skeleton type="text" width="100px" />
                        </div>
                        <q-space />
                        <div class="column q-mr-md">
                            <q-skeleton type="text" width="160px" />
                            <div class="column">
                                <q-skeleton type="text" />
                                <q-skeleton type="text" class="q-ml-lg" />
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <RentDetailsCardSec :editable="false" :rentDetails="rentDetails" />
            </q-card>
        </div>
        <div class="col-xs-12 col-sm-7">
            <OrderInfoSkeleton v-if="order == undefined" />
            <OrderInfoCard v-else-if="order.payments[0].status != 'IN'" :order="order" @post-rate="onOrderRated"
                @post-status-update="onOrderStatusUpdated" />
            <div v-else>
                <PaymentVaCard v-if="getPaymentMethod() == 'Virtual Account'" :order="order" />
                <q-card flat v-else-if="getPaymentMethod() == 'Credit Card'">
                    <q-card-section>
                        <div class="text-h6 text-center">Detail Pembayaran</div>

                        <q-card-actions align="right" class="q-mt-xl">
                            <q-btn unelevated color="secondary" text-color="accent" label="Kembali ke riwayat"
                                @click="back" />
                        </q-card-actions>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CryptoService from '@/services/crypto.service';
import OrderService from '@/services/order.service';
import { formatTimestampToDate, formatTimestampToTime } from '@/composables/formatter';
import RentDetailsCardSec from '@/components/cards/RentDetailsCardSec.vue';
import type { RentDetails } from '@/interfaces/RentDetails';
import { ionLocation } from '@quasar/extras/ionicons-v6';
import type { Order } from '@/interfaces/rest/Order';
import PaymentVaCard from '@/components/cards/PaymentVaCard.vue';
import OrderInfoCard from '@/components/cards/OrderInfoCard.vue';
import OrderInfoSkeleton from '@/components/skeleton/OrderInfoSkeleton.vue';

const route = useRoute();
const router = useRouter();
const order = ref<Order>();
const rentDetails = ref<RentDetails>();

function getOrderDetails(orderId: number) {
    OrderService.get(orderId).then((response) => {
        // console.log(response.data);
        order.value = response.data;

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
    });
}

function getPaymentMethod() {
    if (order.value != undefined) {
        return order.value.payments[0].payment_method;
    }
}

function back() {
    router.go(-1);
}

function onOrderRated(orderId: number) {
    getOrderDetails(orderId);
}

function onOrderStatusUpdated(orderId: number) {
    order.value = undefined;
    getOrderDetails(orderId);
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