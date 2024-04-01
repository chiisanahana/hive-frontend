<template>
    <q-card flat class="q-pa-md">
        <q-card-section>
            <div class="text-h6 text-center q-mb-md">
                <div>Please finish your payment in</div>
                <vue-countdown v-if="time > 0" class="text-accent" :time="time" v-slot="{ minutes, seconds }">
                    {{ minutes }} : {{ seconds }}
                </vue-countdown>
                <div v-else class="text-accent">-- : --</div>
            </div>
            <div class="text-center text-blue-grey-4">
                Payment is due by {{ getPaymentDue() }}
            </div>

            <q-card flat bordered class="q-ma-lg">
                <q-card-section>
                    <div class="text-bold">BCA Virtual Account</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <div class="row">
                        <div class="col column">
                            <span class="text-blue-grey-4">Virtual Account Number</span>
                            <span class="text-bold">{{ va }}</span>
                        </div>
                        <div class="row col-3 justify-end">
                            <q-btn flat text-color="accent" label="Copy" :icon="ionCopy" no-caps @click="copy(va)" />
                        </div>
                    </div>
                </q-card-section>
                <q-card-section>
                    <div class="col column">
                        <span class="text-blue-grey-4">Total Payment</span>
                        <div class="row items-center">
                            <span class="text-bold">{{ price }}</span>
                            <q-btn round flat color="accent" :icon="ionCopy" size="sm" class="q-ml-xs"
                                @click="copy(price!)" />
                        </div>
                    </div>
                </q-card-section>

            </q-card>

            <q-card-actions align="right" class="q-mt-xl">
                <q-btn unelevated color="secondary" text-color="accent" label="Explore cars" to="cars" />
                <q-btn color="primary" label="View history" style="min-width: 140px;" to="history" />
            </q-card-actions>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar, date, copyToClipboard } from 'quasar';
import type { Order } from '@/interfaces/rest/Order';
import { ionCopy } from '@quasar/extras/ionicons-v6';
import { calcRentPrice } from '@/composables/calculator';
import { formatAmount, formatTimestampToDateDisplay } from '@/composables/formatter';

const props = defineProps<{
    order: Order
}>();
const quasar = useQuasar();
const va: string = '9360081234567890';
const expiredTime = ref<any>(Date.parse(props.order.payments[0].transaction_datetime!) + 600000);
const time = ref<number>(expiredTime.value - new Date().getTime());
const price = ref<string>();

function getPaymentDue() {
    return date.formatDate(expiredTime.value, 'D MMM YYYY HH:mm:ss');
}

function copy(text: string) {
    copyToClipboard(text).then(() => {
        quasar.notify({
            group: false,
            color: 'secondary',
            textColor: 'accent',
            position: 'bottom',
            message: 'Coppied!'
        });
    });
}

function getRentPrice() {
    if (props.order.car != undefined) {
        return calcRentPrice(
            formatTimestampToDateDisplay(props.order.start_datetime),
            formatTimestampToDateDisplay(props.order.end_datetime),
            props.order.car.price as number, props.order.car.deposit as number);
    }
}

onMounted(() => {
    price.value = formatAmount(getRentPrice());
});
</script>

<style scoped>
.payment-method {
    width: 48px;
}
</style>