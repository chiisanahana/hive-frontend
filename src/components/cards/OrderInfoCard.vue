<template>
    <q-card flat>
        <q-card-section>
            <div class="row q-mb-md">
                <div class="text-body1 text-bold ">Order Details</div>
                <q-space />
                <q-badge color="accent">{{ getOrderStatus(order.status) }}</q-badge>
            </div>
            <div class="q-gutter-sm q-mb-lg">
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">Order created date</div>
                    <div class="col-xs-12 col-sm-6">{{ formatTimestampToDateDisplay(order.created_datetime) }} {{
                        formatTimestampToTimeFull(order.created_datetime) }}</div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">Invoice number</div>
                    <div class="row col-xs-12 col-sm-6">
                        {{ order.payments[0].invoice_no }}
                        <q-btn flat dense round color="accent" :icon="ionCopy" size="sm" class="q-ml-md"
                            @click="copy(order.payments[0].invoice_no)" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">Payment method</div>
                    <div class="col-xs-12 col-sm-6">{{ order.payments[0].payment_method }}</div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">Transaction date</div>
                    <div class="col-xs-12 col-sm-6">{{ getTransactionDateTime() }}</div>
                </div>
                <q-list>
                    <q-expansion-item dense v-model="paymentExpanded" header-class="order-expansion"
                        :expand-icon="ionChevronDown">
                        <template v-slot:header>
                            <div v-if="paymentExpanded" class="row col-12 text-blue-grey-4 text-bold">
                                Transaction Details</div>
                            <div v-else class="row col-12">
                                <div class="col-xs-12 col-sm-6 col-md-4">Total amount</div>
                                <div class="col-xs-12 col-sm text-bold q-pl-xs">
                                    {{ formatAmount(order.payments[0].amount as number) }}
                                </div>
                            </div>
                        </template>
                        <q-card>
                            <q-card-section>
                                <div class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col">Rent price</div>
                                        <div class="col text-right">
                                            {{ calcDateDiff(order.start_datetime, order.end_datetime) + ' x ' +
                                                formatAmount(order.car?.price as number) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col-6">Deposit</div>
                                        <div class="col text-right">
                                            {{ formatAmount(order.car?.deposit as number) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="column col-xs-12 col-md-8">
                                        <hr class="separator" />
                                    </div>
                                </div>
                                <div class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col text-bold">Total amount</div>
                                        <div class="col text-bold text-right">
                                            {{ formatAmount(order.payments[0].amount as number) }}
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
            </div>

            <hr v-if="['4', '5', '6'].includes(order.status)" class="billing-separator" />

            <div v-if="['4', '5', '6'].includes(order.status)" class="q-mt-md q-gutter-sm q-mb-md">
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">Order completed date</div>
                    <div class="col-xs-12 col-sm-6">{{ formatTimestampToDateDisplay(order.updated_datetime) }} {{
                        formatTimestampToTimeFull(order.updated_datetime) }}</div>
                </div>
                <div v-if="!isHasDeposit()" class="row">
                    <q-card flat class="bg-blue-grey-1 q-mt-sm q-pa-sm col-auto">
                        <div class="row items-center">
                            <q-icon :name="ionInformationCircle" color="accent" class="q-mr-sm" size="sm" />
                            This rent does not require deposit.
                        </div>
                    </q-card>
                </div>
                <div v-if="isHasDeposit()" class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">Deposit return date</div>
                    <div class="col-xs-12 col-sm-6">{{
                        formatTimestampToDateDisplay(order.payments[0].deposit_return_time) }} {{
                            formatTimestampToTimeFull(order.payments[0].deposit_return_time) }}</div>
                </div>
                <div v-if="isHasDeposit() && isNoFee()" class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">Deposit return amount</div>
                    <div class="col-xs-12 col-sm text-bold">
                        {{ formatAmount(order.car?.deposit) }}
                    </div>
                </div>
                <q-list v-else-if="isHasDeposit()">
                    <q-expansion-item dense v-model="depositExpanded" header-class="order-expansion"
                        :expand-icon="ionChevronDown">
                        <template v-slot:header>
                            <div v-if="depositExpanded" class="row col-12 text-blue-grey-4 text-bold">
                                Transaction Details</div>
                            <div v-else class="row col-12">
                                <div class="col-xs-12 col-sm-6 col-md-4">Deposit return amount</div>
                                <div class="col-xs-12 col-sm text-bold">
                                    {{ formatAmount(calcDepositReturn(order)) }}
                                </div>
                            </div>
                        </template>
                        <q-card>
                            <q-card-section>
                                <div class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col">Deposit</div>
                                        <div class="col text-right">
                                            {{ formatAmount(order.car?.deposit as number) }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="parseInt(order.late_fee!) != 0" class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col-6">Late return charge</div>
                                        <div class="col text-right">
                                            {{ formatAmount(parseInt(order.late_fee!)) }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="parseInt(order.damage_fee!) != 0" class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col-6">Car damage charge</div>
                                        <div class="col text-right">
                                            {{ formatAmount(parseInt(order.damage_fee!)) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="column col-xs-12 col-md-8">
                                        <hr class="separator" />
                                    </div>
                                </div>
                                <div class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col text-bold">Deposit return amount</div>
                                        <div class="col text-bold text-right">
                                            {{ formatAmount(calcDepositReturn(order)) }}
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
            </div>
        </q-card-section>
        <q-card-actions>
            <q-btn unelevated color="secondary" :icon="ionChevronBack" label="Back" text-color="accent" @click="goBack"
                no-caps />
        </q-card-actions>
    </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, date, copyToClipboard } from 'quasar';
import type { Order } from '@/interfaces/rest/Order';
import { formatAmount, formatTimestampToDateDisplay, formatTimestampToTimeFull } from '@/composables/formatter';
import { getOrderStatus } from '@/composables/getter';
import { ionChevronBack, ionChevronDown, ionCopy, ionInformation, ionInformationCircle } from '@quasar/extras/ionicons-v6';
import { calcDateDiff, calcDepositReturn } from '@/composables/calculator';

const props = defineProps<{
    order: Order
}>();
const router = useRouter();
const quasar = useQuasar();
const paymentExpanded = ref<boolean>(false);
const depositExpanded = ref<boolean>(false);

function getTransactionDateTime() {
    if (props.order.payments[0].payment_method == 'Virtual Account') {
        const datetime = Date.parse(props.order.payments[0].transaction_datetime!) + 600000;
        return date.formatDate(datetime, 'D MMM YYYY HH:mm:ss');
    } else {
        return formatTimestampToDateDisplay(props.order.payments[0].transaction_datetime) + ' ' +
            formatTimestampToTimeFull(props.order.payments[0].transaction_datetime)
    }
}

function isHasDeposit() {
    return props.order.car?.deposit != 0;
}

function isNoFee() {
    return props.order.damage_fee == "0" && props.order.late_fee == "0";
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

function goBack() {
    router.go(-1);
}
</script>

<style>
.order-expansion {
    padding-left: 0;
}

.separator {
    border: none;
    border-top: 1px solid #D1D1D1;
    height: 3px;
    margin-left: 0;
    margin-right: 0;
}

.billing-separator {
    border: none;
    border-top: 2px dashed #D1D1D1;
    height: 3px;
}
</style>