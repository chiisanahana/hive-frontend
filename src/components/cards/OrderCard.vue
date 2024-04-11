<template>
    <q-card flat bordered class="q-mb-md">
        <q-card-section class="q-pa-sm">
            <div class="row items-center q-gutter-x-md q-mb-md">
                <div class="text-body2 text-blue-grey-4">{{ order.payments[0].invoice_no }}</div>
                <q-badge color="accent">{{ getOrderStatus(order.status) }}</q-badge>
            </div>

            <div class="row">
                <div class="column justify-center q-mr-lg">
                    <img width="120px" class="rounded-borders" :src="getCarImg(order.car?.car_files[0] || null)" />

                </div>
                <div class="column q-gutter-xs">
                    <div class="text-body1 text-bold">{{ order.car?.brand }}</div>
                    <div class="row items-center">
                        <q-icon :name="ionLocation" class="q-mr-xs" />
                        {{ getLocation() }}
                    </div>
                    <div class="row">
                        <div class="column">
                            <div class="row items-center q-mb-xs">
                                <q-icon :name="ionCalendar" class="q-mr-xs" />
                                {{ formatTimestampToDateDisplay(order.start_datetime) }}
                            </div>
                            <div class="row items-center">
                                <q-icon :name="ionTime" class="q-mr-xs" />
                                {{ formatTimestampToTime(order.start_datetime) }}
                            </div>
                        </div>
                        <div class="column q-mx-sm"> ~ </div>
                        <div class="column">
                            <span class="q-mb-xs">
                                {{ formatTimestampToDateDisplay(order.end_datetime) }}
                            </span>
                            <span class="q-mb-xs">
                                {{ formatTimestampToTime(order.end_datetime) }}
                            </span>
                        </div>
                    </div>
                </div>
                <q-space />
                <div class="column q-mr-md justify-center items-end">
                    <div class="text-blue-grey-4">Total</div>
                    <div class="text-body1 text-bold">{{ formatAmount(totalPrice) }}</div>
                </div>
            </div>

            <q-card-actions align="right">
                <q-btn flat text-color="accent" label="View details" no-caps @click="viewDetails" />
                <q-btn v-if="order.status == '1'" unelevated color="secondary" text-color="accent" label="Reject"
                    style="min-width: 140px;" @click="setStatus('6')" />
                <q-btn v-if="order.status == '1'" unelevated color="accent" label="Approve" style="min-width: 140px;"
                    @click="setStatus('2')" />
                <q-btn v-else-if="order.status == '2'" unelevated color="accent" label="Complete"
                    style="min-width: 140px;" @click="handleCompleteOrder" />
            </q-card-actions>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QSpinnerGears, useQuasar } from 'quasar';
import CryptoService from '@/services/crypto.service';
import OrderService from '@/services/order.service';
import type { Order } from '@/interfaces/rest/Order';
import { formatAmount, formatTimestampToDateDisplay, formatTimestampToTime } from '@/composables/formatter';
import { ionCalendar, ionLocation, ionTime } from '@quasar/extras/ionicons-v6';
import { getCarImg, getOrderStatus } from '@/composables/getter';
import { Message, UserType } from '@/enums/enum';
import type { Payment } from '@/interfaces/rest/Payment';
import UserService from '@/services/user.service';
import { useProviderStore } from '@/stores/provider';

const props = defineProps<{
    order: Order
}>();
const emit = defineEmits<{
    postUpdate: [orderId: number, status: string]
}>();

const router = useRouter();
const quasar = useQuasar();
const payments = ref<Payment[]>([]);
const totalPrice = ref<number>(0);
const providerStore = useProviderStore();

function getLocation() {
    return props.order.car?.provider?.city + ', ' + props.order.car?.provider?.province;
}

function setStatus(status: string) {
    quasar.loading.show({ spinner: QSpinnerGears });
    OrderService.updateOrderStatus(props.order.id!, status)
        .then((response) => {
            // console.log(response.data)
            quasar.notify({
                color: 'positive',
                position: 'top-right',
                message: status == '2' ? Message.ORDER_APPROVE_SUCCESS : Message.ORDER_REJECT_SUCCESS
            });
            emit('postUpdate', props.order.id!, status);
            quasar.loading.hide();
        }).catch((error) => {
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
            quasar.loading.hide();
        });
}

function handleCompleteOrder() {
    quasar.loading.show({ spinner: QSpinnerGears });
    OrderService.completeOrder(props.order.id!, props.order.car?.provider?.id!)
        .then((response) => {
            UserService.get(UserService.getLoggedInPrv().id, UserType.P)
                .then((response) => {
                    UserService.storeUser(response.data, UserType.P);
                    providerStore.setLoggedInUser(response.data);
                    quasar.notify({
                        color: 'positive',
                        position: 'top-right',
                        message: Message.ORDER_COMPLETED
                    });
                    emit('postUpdate', props.order.id!, '4');
                    quasar.loading.hide();
                });
        }).catch((error) => {
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
            quasar.loading.hide();
        });
}

function viewDetails() {
    const encryptedId = CryptoService.encrypt(props.order?.id);
    // router.push({ name: 'history-details', query: { oid: encryptedId } })
}

onMounted(() => {
    payments.value = props.order.payments;
    payments.value.forEach(payment => {
        totalPrice.value += +payment.amount as number;
    });
});
</script>