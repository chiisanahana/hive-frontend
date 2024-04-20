<template>
    <div class="q-pa-md">
        <q-card flat>
            <q-card-section>
                <div class="text-h6">Kelola Penyewaan</div>
            </q-card-section>

            <q-card-section>
                <!-- Filter -->
                <div class="row items-center q-mb-md">
                    <div class="text-bold q-mr-lg">Status</div>
                    <div class="row q-gutter-x-sm buttons">
                        <q-btn outline :color="filter == '' ? 'accent' : 'blue-grey-4'" label="Semua" no-caps
                            @click="resetFilter" />
                        <q-btn outline :color="filter == 'pending' ? 'accent' : 'blue-grey-4'" label="Menunggu" no-caps
                            @click="filterBtn('pending')" />
                        <q-btn outline :color="filter == 'ongoing' ? 'accent' : 'blue-grey-4'" label="Berjalan" no-caps
                            @click="filterBtn('ongoing')" />
                        <q-btn outline :color="filter == 'completed' ? 'accent' : 'blue-grey-4'" label="Selesai"
                            no-caps @click="filterBtn('completed')" />
                    </div>
                </div>

                <!-- Data -->
                <HistoryCardSkeleton v-if="isLoading" v-for="n in 4" :key="n" />
                <div v-else-if="orders.length == 0" class="q-pa-lg text-center text-blue-grey-4">
                    Tidak ada permintaan
                </div>
                <OrderCard v-else v-for="order in orders" :order="order" @post-update="onOrderUpdated" />
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import UserService from '@/services/user.service';
import type { Order } from '@/interfaces/rest/Order';
import OrderService from '@/services/order.service';
import HistoryCardSkeleton from '@/components/skeleton/HistoryCardSkeleton.vue';
import OrderCard from '@/components/cards/OrderCard.vue';
import router from '@/router';

const route = useRoute();
const data = ref<Order[]>([]);
const orders = ref<Order[]>([]);
const filter = ref<string>('');
const isLoading = ref<boolean>(false);

watch(
    () => route.query.status, async () => {
        const status = route.query.status;
        if (typeof status === 'string') filter.value = status;
        filterOrders(filter.value);
    }
)

function getOrders() {
    isLoading.value = true;
    OrderService.getByProviderId(UserService.getLoggedInPrv().id)
        .then((response) => {
            data.value = response.data.filter((order: any) => {
                // just make sure to show only sucessful order with payment initiated
                // also not to show payment pending
                return order.payments.length > 0 && order.status != '0';
            });
            filterOrders(filter.value);
            isLoading.value = false;
        })
        .catch((error) => {
            console.log(error);
            isLoading.value = false;
        });
}

function filterOrders(key: string) {
    filter.value = key;
    switch (key) {
        case 'pending':
            orders.value = data.value.filter((order: any) => {
                return order.status == '1';
            })
            break;
        case 'ongoing':
            orders.value = data.value!.filter((order: any) => {
                return ['2', '3'].includes(order.status);
            })
            break;
        case 'completed':
            orders.value = data.value!.filter((order: any) => {
                return ['4', '5', '6'].includes(order.status);
            })
            break;

        default:
            orders.value = data.value;
            break;
    }
}

function resetFilter() {
    router.push({ name: 'view-orders' });
    filter.value = '';
    orders.value = data.value;
}

function filterBtn(query: string) {
    router.push({ name: 'view-orders', query: { status: query } });
}

function onOrderUpdated(orderId: number, status: string) {
    data.value.map((data) => {
        if (data.id == orderId) data.status = status;
    });
    filterOrders(filter.value);
}

onMounted(() => {
    const status = route.query.status;
    if (typeof status === 'string') filter.value = status;
    getOrders();
});
</script>