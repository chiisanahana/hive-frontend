<template>
    <q-card flat bordered class="q-mb-md">
        <q-card-section class="q-pa-sm">
            <div class="row items-center q-gutter-x-md q-mb-md">
                <div class="text-body2 text-blue-grey-4">{{ props.order?.payments[0].invoice_no }}</div>
                <q-badge color="accent">{{ getOrderStatus(props.order?.status!) }}</q-badge>
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
                <q-btn flat text-color="accent" label="View details" no-caps @click="viewDetails" />
                <q-btn v-if="props.order?.status == '4' && !isRated" unelevated color="primary" label="Rate"
                    style="min-width: 140px;" @click="ratingDialog = true" />
                <q-btn v-else-if="['0', '1'].includes(props.order?.status!)" unelevated color="secondary"
                    text-color="accent" label="Cancel" style="min-width: 140px;" />
            </q-card-actions>
        </q-card-section>
    </q-card>
    <RatingDialog v-model="ratingDialog" :orderId="props.order?.id!" @post-rate="onOrderRated" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Order } from '@/interfaces/rest/Order';
import { getCarImg, getOrderStatus } from '@/composables/getter';
import { formatAmount, formatTimestampToDate, formatTimestampToDateDisplay } from '@/composables/formatter';
import { ionCalendar, ionLocation } from '@quasar/extras/ionicons-v6';
import { calcDateDiff } from '@/composables/calculator';
import RatingDialog from '@/components/dialog/RatingDialog.vue';
import CryptoService from '@/services/crypto.service';

const props = defineProps<{
    order: Order | undefined
}>();
const emit = defineEmits<{
    postRate: [orderId: number, rating: number]
}>();
const isRated = computed(() => props.order?.rating != undefined && props.order.rating != null);
const isSameDay = computed(() => calcDateDiff(formatTimestampToDate(props.order?.start_datetime!), formatTimestampToDate(props.order?.end_datetime!)) == 1);
const ratingDialog = ref<boolean>(false);
const router = useRouter();

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

function viewDetails() {
    const encryptedId = CryptoService.encrypt(props?.order?.id);
    router.push({ name: 'history-details', query: { oid: encryptedId } })
}
</script>