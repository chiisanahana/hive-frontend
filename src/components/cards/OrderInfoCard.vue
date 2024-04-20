<template>
    <q-card flat>
        <q-card-section>
            <div class="row q-mb-md">
                <div class="text-body1 text-bold ">Detail Pembayaran</div>
                <q-space />
                <q-badge color="primary">{{ getOrderStatus(order.status) }}</q-badge>
            </div>
            <div class="q-gutter-sm q-mb-lg">
                <!-- <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Waktu penyewaan</div>
                    <div class="col-xs-12 col-sm-6">{{ formatTimestampToDateDisplay(order.created_datetime) }} {{
                        formatTimestampToTimeFull(order.created_datetime) }}</div>
                </div> -->
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Kode invoice</div>
                    <div class="row col-xs-12 col-sm-6">
                        {{ order.payments[0].invoice_no }}
                        <q-btn flat dense round color="accent" :icon="ionCopy" size="sm" class="q-ml-md"
                            @click="copy(order.payments[0].invoice_no)" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Metode pembayaran</div>
                    <div class="col-xs-12 col-sm-6">{{ order.payments[0].payment_method }}</div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Waktu pembayaran</div>
                    <div class="col-xs-12 col-sm-6">{{ getTransactionDateTime() }}</div>
                </div>
                <q-list>
                    <q-expansion-item dense v-model="paymentExpanded" header-class="order-expansion"
                        :expand-icon="ionChevronDown" expand-icon-class="expand-icon">
                        <template v-slot:header>
                            <div v-if="paymentExpanded" class="row col-12 text-blue-grey-4 text-bold">
                                Detail Transaksi</div>
                            <div v-else class="row col-12">
                                <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Total pembayaran</div>
                                <div class="col-xs-12 col-sm-6 text-bold q-pl-xs">
                                    {{ formatAmount(order.payments[0].amount as number) }}
                                </div>
                            </div>
                        </template>
                        <q-card>
                            <q-card-section>
                                <div class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col">Harga sewa</div>
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
                                        <div class="col text-bold">Total pembayaran</div>
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
                    <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Waktu selesai</div>
                    <div class="col-xs-12 col-sm-6">{{ formatTimestampToDateDisplay(order.updated_datetime) }} {{
                        formatTimestampToTimeFull(order.updated_datetime) }}</div>
                </div>
                <div v-if="!isHasDeposit()" class="row">
                    <q-card flat class="bg-blue-grey-1 q-mt-sm q-pa-sm col-auto">
                        <div class="row items-center">
                            <q-icon :name="ionInformationCircle" color="accent" class="q-mr-sm" size="sm" />
                            Penyewaan ini tidak membutuhkan deposit.
                        </div>
                    </q-card>
                </div>
                <div v-if="isHasDeposit()" class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Pengembalian deposit</div>
                    <div class="col-xs-12 col-sm-6">{{
                        formatTimestampToDateDisplay(order.payments[0].deposit_return_time) }} {{
                            formatTimestampToTimeFull(order.payments[0].deposit_return_time) }}</div>
                </div>
                <div v-if="isHasDeposit() && isNoFee()" class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Jumlah pengembalian</div>
                    <div class="col-xs-12 col-sm text-bold">
                        {{ formatAmount(order.car?.deposit) }}
                    </div>
                </div>
                <q-list v-else-if="isHasDeposit()">
                    <q-expansion-item dense v-model="depositExpanded" header-class="order-expansion"
                        :expand-icon="ionChevronDown">
                        <template v-slot:header>
                            <div v-if="depositExpanded" class="row col-12 text-blue-grey-4 text-bold">
                                Detail pengembalian</div>
                            <div v-else class="row col-12">
                                <div class="col-xs-12 col-sm-6 col-md-4 q-mr-md">Total pengembalian</div>
                                <div class="col-xs-12 col-sm-6 text-bold">
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
                                        <div class="col-6">Biaya keterlambatan</div>
                                        <div class="col text-right">
                                            {{ formatAmount(parseInt(order.late_fee!)) }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="parseInt(order.damage_fee!) != 0" class="row q-mb-sm">
                                    <div class="row col-xs-12 col-md-8">
                                        <div class="col-6">Biaya kerusakan</div>
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
                                        <div class="col text-bold">Total pengembalian</div>
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
        <q-card-actions align="right">
            <div v-if="order.rating && isRated" class="q-ml-xs">
                <q-icon v-for="i in order.rating" name="r_star" size="sm" color="warning" class="q-mr-xs" />
                <q-icon v-for="i in (5 - order.rating)" name="r_star" size="sm" class="q-mr-xs" />
            </div>
            <q-space v-if="isRated" />
            <q-btn unelevated :icon="ionChevronBack" label="Kembali" text-color="accent" @click="goBack" no-caps />

            <!-- Customer actions -->
            <q-btn v-if="!isProvider && order.status == '4' && !isRated" unelevated color="primary" label="Nilai"
                style="min-width: 140px;" @click="ratingDialog = true" />
            <q-btn v-else-if="!isProvider && ['0', '1'].includes(order?.status!)" unelevated color="secondary"
                text-color="accent" label="Batal" style="min-width: 140px;" @click="cancelDialog = true" />

            <!-- Provider actions -->
            <q-btn v-if="isProvider && order.status == '1'" unelevated color="secondary" text-color="accent"
                label="Tolak" @click="setStatus('6')" />
            <q-btn v-if="isProvider && order.status == '1'" unelevated color="accent" label="Setujui"
                @click="setStatus('2')" />
            <q-btn v-else-if="isProvider && order.status == '2'" unelevated color="accent" label="Tandai Selesai"
                @click="handleCompleteOrder" />
        </q-card-actions>
    </q-card>
    <ConfirmDialog v-model="cancelDialog" message="Apakah kamu yakin untuk membatalkan penyewaan ini?"
        hint="Pembayaranmu akan dikembalikan." action-btn-title="Ya" cancel-btn-title="Tidak"
        @confirm-action="cancelOrder()" />
    <RatingDialog v-model="ratingDialog" :orderId="props.order?.id!" @post-rate="onOrderRated" />
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, date, copyToClipboard } from 'quasar';
import type { Order } from '@/interfaces/rest/Order';
import OrderService from '@/services/order.service';
import UserService from '@/services/user.service';
import NotifService from '@/services/notification.service';
import { formatAmount, formatTimestampToDateDisplay, formatTimestampToTimeFull } from '@/composables/formatter';
import { getOrderStatus } from '@/composables/getter';
import { ionChevronBack, ionChevronDown, ionCopy, ionInformationCircle } from '@quasar/extras/ionicons-v6';
import { calcDateDiff, calcDepositReturn } from '@/composables/calculator';
import RatingDialog from '@/components/dialog/RatingDialog.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { Message, UserType, Notif } from '@/enums/enum';
import { useProviderStore } from '@/stores/provider';

const props = defineProps<{
    order: Order
}>();
const emit = defineEmits<{
    postRate: [orderId: number]
    postStatusUpdate: [orderId: number]
}>();
const route = useRoute();
const router = useRouter();
const quasar = useQuasar();
const paymentExpanded = ref<boolean>(false);
const depositExpanded = ref<boolean>(false);
const isRated = computed(() => props.order.rating != undefined && props.order.rating != null);
const ratingDialog = ref<boolean>(false);
const cancelDialog = ref<boolean>(false);
const isProvider = ref<boolean>();
const providerStore = useProviderStore();

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
            message: 'Berhasil menyalin!'
        });
    });
}

function goBack() {
    router.go(-1);
}

function onOrderRated(orderId: number, rating: number) {
    emit('postRate', orderId);
}

function cancelOrder() {
    OrderService.cancelOrder(props.order!.id!).then((response) => {
        NotifService.createNotif(props.order?.car?.provider!.id!, UserType.P,
            Notif.ORDER_CANCEL_TITLE,
            Notif.ORDER_CANCEL_MSG.replace('{car}', props.order?.car?.brand!).replace('{date}', formatTimestampToDateDisplay(props.order?.start_datetime))
        );
        emit('postStatusUpdate', props.order!.id!);
        quasar.notify({
            color: 'positive',
            position: 'top-right',
            message: Message.ORDER_CANCELLED
        });
    });
}

function setStatus(status: string) {
    OrderService.updateOrderStatus(props.order.id!, status)
        .then((response) => {
            // console.log(response.data)
            let title: string = status == '2' ? Notif.RENT_APPROVE_TITLE : Notif.RENT_REJECT_TITLE;
            let message: string = status == '2' ? Notif.RENT_APPROVE_MSG : Notif.RENT_REJECT_MSG;
            message = message.replace('{car}', props.order.car?.brand!).replace('{city}', props.order.car?.provider?.city!);

            NotifService.createNotif(props.order.customer!.id, UserType.C, title, message)
                .then((response) => {
                    if (status == '6') {
                        NotifService.createNotif(props.order.customer!.id, UserType.C,
                            Notif.PAYMENT_REFUND_TITLE,
                            Notif.PAYMENT_REFUND_MSG.replace('{amount}', props.order.payments[0].amount.toString()).replace('{invoice}', props.order.payments[0].invoice_no)
                        );
                    }
                });

            quasar.notify({
                color: 'positive',
                position: 'top-right',
                message: status == '2' ? Message.ORDER_APPROVE_SUCCESS : Message.ORDER_REJECT_SUCCESS
            });
            emit('postStatusUpdate', props.order!.id!);
        }).catch((error) => {
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
        });
}

function handleCompleteOrder() {
    OrderService.completeOrder(props.order.id!, props.order.car?.provider?.id!)
        .then((response) => {
            UserService.get(UserService.getLoggedInPrv().id, UserType.P)
                .then((response) => {
                    NotifService.createNotif(props.order.customer!.id, UserType.C,
                        Notif.RENT_COMPLETE_TITLE,
                        Notif.RENT_COMPLETE_MSG.replace('{car}', props.order.car?.brand!).replace('{city}', props.order.car?.provider?.city!)
                    ).then((response) => {
                        if (props.order.car?.deposit != 0) {
                            NotifService.createNotif(props.order.customer!.id, UserType.C,
                                Notif.DEPOSIT_REFUND_TITLE,
                                Notif.DEPOSIT_REFUND_MSG.replace('{amount}', calcDepositReturn(props.order).toString()).replace('{invoice}', props.order.payments[0].invoice_no)
                            );
                        }
                    });

                    UserService.storeUser(response.data, UserType.P);
                    providerStore.setLoggedInUser(response.data);
                    quasar.notify({
                        color: 'positive',
                        position: 'top-right',
                        message: Message.ORDER_COMPLETED
                    });
                    emit('postStatusUpdate', props.order!.id!);
                });
        }).catch((error) => {
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
        });
}

onBeforeMount(() => {
    isProvider.value = route.fullPath.includes('provider');
})
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

.expand-icon {
    margin-left: -8px;
}
</style>