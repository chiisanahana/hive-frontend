<template>
    <div class="row q-pa-md q-gutter-md justify-center">
        <q-card flat class="col-9">
            <q-card-section>
                <div class="text-h6">Transaction History</div>
            </q-card-section>

            <q-card-section>
                <!-- Filter -->
                <div class="row items-center q-mb-md">
                    <div class="text-bold q-mr-lg">Status</div>
                    <div class="row q-gutter-x-sm buttons">
                        <q-btn outline :color="filter == '' ? 'accent' : 'blue-grey-4'" label="All" no-caps
                            @click="resetFilter" />
                        <q-btn outline :color="filter == 'completed' ? 'accent' : 'blue-grey-4'" label="Completed"
                            no-caps @click="filterOrders('completed')" />
                        <q-btn outline :color="filter == 'ongoing' ? 'accent' : 'blue-grey-4'" label="Ongoing" no-caps
                            @click="filterOrders('ongoing')" />
                        <q-btn outline :color="filter == 'cancelled' ? 'accent' : 'blue-grey-4'" label="Cancelled"
                            no-caps @click="filterOrders('cancelled')" />
                    </div>
                </div>

                <!-- Data -->
                <HistoryCardSkeleton v-if="isLoading" v-for="n in 4" :key="n" />
                <div v-else-if="orders.length == 0" class="q-pa-lg text-center text-blue-grey-4">
                    No history
                </div>
                <OrderHistoryCard v-else v-for="order in orders" :order="order" />
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserService from '@/services/user.service';
import type { Order } from '@/interfaces/rest/Order';
import OrderService from '@/services/order.service';
import HistoryCardSkeleton from '@/components/skeleton/HistoryCardSkeleton.vue';
import OrderHistoryCard from '@/components/cards/OrderHistoryCard.vue';

const data = ref<Order[]>([]);
const orders = ref<Order[]>([]);
const filter = ref<string>('');
const isLoading = ref<boolean>(false);

function getOrders() {
    isLoading.value = true;
    OrderService.getByCustomerId(UserService.getLoggedInCust().id)
        .then((response) => {
            data.value = response.data.filter((order: any) => {
                // just make sure to show only sucessful order with payment initiated
                return order.payments.length > 0;
            });
            data.value.sort((order1: any, order2: any) => {
                return order1.id - order2.id;
            })
            orders.value = data.value;
            filter.value = '';
            isLoading.value = false;
            // console.log(orders.value);
        })
        .catch((error) => {
            console.log(error);
            isLoading.value = false;
        });
}

function filterOrders(key: string) {
    filter.value = key;
    switch (key) {
        case 'completed':
            orders.value = data.value.filter((order: any) => {
                return order.status == '4';
            })
            break;
        case 'ongoing':
            orders.value = data.value!.filter((order: any) => {
                return ['0', '1', '2', '3'].includes(order.status);
            })
            break;
        case 'cancelled':
            orders.value = data.value!.filter((order: any) => {
                return order.status == '5';
            })
            break;

        default:
            break;
    }
}

function resetFilter() {
    filter.value = '';
    orders.value = data.value;
}

onMounted(() => {
    getOrders();
});
</script>