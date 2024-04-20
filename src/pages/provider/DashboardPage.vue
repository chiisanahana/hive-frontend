<template>
    <div class="container q-pa-md">
        <div class="text-h6 text-white q-mb-lg">Pantau Aktivitas Terbaru</div>
        <div v-if="isLoading" class="row q-col-gutter-md q-mb-lg">
            <div class="col" v-for="i in 6">
                <q-card>
                    <q-card-section>
                        <q-skeleton type="rect" class="q-mb-md" />
                        <q-skeleton type="rect" width="40px" />
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div v-else class="row q-col-gutter-md q-mb-lg">
            <div class="col">
                <q-card>
                    <q-card-section>
                        <div class="text-blue-grey-4 q-mb-sm">Permintaan baru</div>
                        <div class="text-h6">{{ pendingOrders.length }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col">
                <q-card>
                    <q-card-section>
                        <div class="text-blue-grey-4 q-mb-sm">Sewa berjalan</div>
                        <div class="text-h6">{{ ongoingOrders.length }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col">
                <q-card>
                    <q-card-section>
                        <div class="text-blue-grey-4 q-mb-sm">Pesan baru</div>
                        <div class="text-h6">{{ newChats.length }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col">
                <q-card>
                    <q-card-section>
                        <div class="text-blue-grey-4 q-mb-sm">Total mobil</div>
                        <div class="text-h6">{{ cars.length }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col">
                <q-card>
                    <q-card-section>
                        <div class="text-blue-grey-4 q-mb-sm">Mobil inaktif</div>
                        <div class="text-h6">{{ inactiveCars.length }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col">
                <q-card>
                    <q-card-section>
                        <div class="text-blue-grey-4 q-mb-sm">Pendapatan</div>
                        <div class="text-h6">{{ formatAmount(0) }}</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <q-card>
            <q-card-section>
                <div class="text-bold">Statistik</div>
            </q-card-section>
            <div v-if="isLoading" class="row q-pa-md q-col-gutter-md">
                <div class="col" v-for="i in 5">
                    <q-card flat bordered>
                        <q-card-section>
                            <q-skeleton type="rect" class="q-mb-sm" />
                            <q-skeleton type="rect" width="40px" />
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div v-else>
                <q-card-section class="row q-pa-md q-col-gutter-md">
                    <div class="col">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="text-blue-grey-4 q-mb-sm"> Mobil Dilihat </div>
                                <div class="text-body1 text-bold">0</div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="text-blue-grey-4 q-mb-sm"> Mobil Disewa </div>
                                <div class="text-body1 text-bold">0</div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="text-blue-grey-4 q-mb-sm"> Sewa Dibatalkan </div>
                                <div class="text-body1 text-bold">0</div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="text-blue-grey-4 q-mb-sm"> Mobil Rusak </div>
                                <div class="text-body1 text-bold">0</div>
                            </q-card-section>
                        </q-card>
                    </div>
                    <div class="col">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="text-blue-grey-4 q-mb-sm"> Terlambat Kembali </div>
                                <div class="text-body1 text-bold">0</div>
                            </q-card-section>
                        </q-card>
                    </div>
                </q-card-section>
            </div>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { formatAmount } from '@/composables/formatter';
import type { Car } from '@/interfaces/rest/Car';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import type { Order } from '@/interfaces/rest/Order';
import CarService from '@/services/car.service';
import ChatService from '@/services/chat.service';
import OrderService from '@/services/order.service';
import UserService from '@/services/user.service';
import { computed, onMounted, ref } from 'vue';

const providerId = UserService.getLoggedInPrv().id;
const isLoading = ref<boolean>(false);
const orders = ref<Order[]>([]);
const pendingOrders = computed<Order[]>(() => orders.value.filter((order: any) => { return order.status == '1' }));
const ongoingOrders = computed<Order[]>(() => orders.value.filter((order: any) => { return ['2', '3'].includes(order.status) }));
const cars = ref<Car[]>([]);
const inactiveCars = computed<Car[]>(() => cars.value.filter((car: any) => { return car.status == '0' }));
const chats = ref<ChatRoom[]>([]);
const newChats = computed<ChatRoom[]>(() => chats.value.filter((room: any) => { return room.chats.length > 0 && room.chats.slice(-1).isread == '0' }))

function getOrders() {
    isLoading.value = true;
    OrderService.getByProviderId(providerId)
        .then((response) => {
            orders.value = response.data;
            isLoading.value = false;
        });
}

function getCars() {
    // isLoading.value = true;
    CarService.getByProviderId(providerId)
        .then((response) => {
            cars.value = response.data;
            // isLoading.value = false;
        })
}

function getChats() {
    // isLoading.value = true;
    ChatService.getRoomByProvider(providerId)
        .then((response) => {
            chats.value = response.data;
        })
    // isLoading.value = false;
}

onMounted(() => {
    getOrders();
    getCars();
    getChats();
})

</script>

<style scoped>
.container {
    background-image: linear-gradient(#86A7FC, #F6F8F9);
}
</style>