<template>
    <q-card flat bordered class="q-mb-md">
        <q-card-section class="q-pa-sm">
            <div class="row items-center q-gutter-x-md q-mb-md">
                <div class="text-body2 text-blue-grey-4">{{ props.order?.payments[0].invoice_no }}</div>
                <q-badge color="primary">{{ getOrderStatus(props.order?.status!) }}</q-badge>
            </div>

            <div class="row">
                <div class="column justify-center q-mr-lg">
                    <img width="120px" class="rounded-borders"
                        :src="getCarImg(props.order?.car?.car_files[0] || null)" />
                </div>
                <div class="column q-gutter-sm">
                    <div class="text-body1 text-bold">{{ props.order?.car?.brand }}</div>
                    <div class="row items-center">
                        <q-icon :name="ionLocation" class="q-mr-xs" />
                        {{ getLocation() }}
                    </div>
                    <div class="row items-center">
                        <q-icon :name="ionCalendar" class="q-mr-xs" />
                        <span v-if="isSameDay">
                            {{ formatTimestampToDateDisplay(props.order?.start_datetime) }}
                        </span>
                        <span v-else>
                            {{ formatTimestampToDateDisplay(props.order?.start_datetime) }} - {{
                                formatTimestampToDateDisplay(props.order?.end_datetime) }}
                        </span>
                    </div>
                </div>
                <q-space />
                <div class="column q-mr-md">
                    <div class="text-blue-grey-4">Total</div>
                    <div class="text-body1 text-bold">{{ formatAmount(sumTotal()) }}</div>
                </div>
            </div>
            <q-card-actions align="right">
                <q-btn flat text-color="accent" label="Lihat detail" no-caps @click="viewDetails" />
                <q-btn v-if="props.order?.status == '4' && !isRated" unelevated color="accent" label="Nilai"
                    style="min-width: 140px;" @click="ratingDialog = true" />
                <q-btn v-else-if="['0', '1'].includes(props.order?.status!)" unelevated color="secondary"
                    text-color="accent" label="Batalkan" style="min-width: 140px;" @click="cancelDialog = true" />
            </q-card-actions>
        </q-card-section>
    </q-card>
    <ConfirmDialog v-model="cancelDialog" message="Apakah kamu yakin untuk membatalkan penyewaan ini?"
        hint="Pembayaranmu akan dikembalikan." action-btn-title="Ya" cancel-btn-title="Tidak"
        @confirm-action="cancelOrder()" />
    <RatingDialog v-model="ratingDialog" :orderId="props.order?.id!" @post-rate="onOrderRated" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import CryptoService from '@/services/crypto.service';
import OrderService from '@/services/order.service';
import NotifService from '@/services/notification.service';
import type { Order } from '@/interfaces/rest/Order';
import { getCarImg, getOrderStatus } from '@/composables/getter';
import { formatAmount, formatTimestampToDate, formatTimestampToDateDisplay } from '@/composables/formatter';
import { ionCalendar, ionLocation } from '@quasar/extras/ionicons-v6';
import { calcDateDiff } from '@/composables/calculator';
import RatingDialog from '@/components/dialog/RatingDialog.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { Message, Notif, UserType } from '@/enums/enum';

const props = defineProps<{
    order: Order | undefined
}>();
const emit = defineEmits<{
    postRate: [orderId: number, rating: number]
    postCancel: [orderId: number]
}>();
const isRated = computed(() => props.order?.rating != undefined && props.order.rating != null);
const isSameDay = computed(() => calcDateDiff(formatTimestampToDate(props.order?.start_datetime!), formatTimestampToDate(props.order?.end_datetime!)) == 1);
const ratingDialog = ref<boolean>(false);
const cancelDialog = ref<boolean>(false);
const router = useRouter();
const quasar = useQuasar();

function getLocation() {
    return props.order?.car?.provider?.city + ', ' + props.order?.car?.provider?.province;
}

function sumTotal() {
    let total = 0;
    if (props.order == undefined) return 0;
    props.order.payments.forEach(payment => {
        total += +payment.amount as number;
    });
    return total;
}

function onOrderRated(orderId: number, rating: number) {
    emit('postRate', orderId, rating);
}

function cancelOrder() {
    OrderService.cancelOrder(props.order!.id!).then((response) => {
        NotifService.createNotif(props.order?.car?.provider!.id!, UserType.P,
            Notif.ORDER_CANCEL_TITLE,
            Notif.ORDER_CANCEL_MSG.replace('{car}', props.order?.car?.brand!).replace('{date}', formatTimestampToDateDisplay(props.order?.start_datetime))
        );
        emit('postCancel', props.order!.id!);
        quasar.notify({
            color: 'positive',
            position: 'top-right',
            message: Message.ORDER_CANCELLED
        });
    });
}

function viewDetails() {
    const encryptedId = CryptoService.encrypt(props?.order?.id);
    router.push({ name: 'history-details', query: { oid: encryptedId } })
}
</script>