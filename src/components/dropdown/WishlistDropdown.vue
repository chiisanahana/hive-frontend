<template>
    <q-menu transition-show="jump-down" transition-hide="jump-up" anchor="bottom middle" self="top middle"
        @before-show="getWishlists()">
        <q-list style="width: 450px">
            <q-item-label header class="q-py-sm">
                <div class="row items-center">
                    <span class="text-bold q-mr-sm">Wishlist</span>({{ wishlists.length }})
                    <q-space />
                    <q-btn flat dense text-color="accent" label="View all" no-caps @click="goToWishlist" />
                </div>
            </q-item-label>
            <q-scroll-area :style="{ height: height }">
                <q-resize-observer @resize="onResize"></q-resize-observer>
                <WishlistDropdownSkeleton v-if="isLoading" />

                <q-item clickable v-else-if="wishlists.length > 0" v-for="wishlist in wishlists"
                    @click="viewCar(wishlist.car!.id)">
                    <q-item-section thumbnail class="q-ml-none">
                        <img
                            src="https://daihatsu.co.id/cdn-cgi/image/width=720/https://cms-headless.daihatsu.co.id/assets/bf37106f-5b63-422e-bd34-97d85b5ef068">
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>{{ wishlist.car?.brand }}</q-item-label>
                        <q-item-label caption>
                            <div class="row items-center q-mb-xs">
                                <q-icon :name="ionLocation" class="q-mr-xs" />
                                {{ wishlist.car?.provider?.city }}, {{ wishlist.car?.provider?.province }}
                            </div>
                            <div class="row">
                                <div class="column">
                                    <div class="row items-center q-mb-xs">
                                        <q-icon :name="ionCalendar" class="q-mr-xs" />
                                        {{ formatDateDisplay(wishlist.start_date) }}
                                    </div>
                                    <div class="row items-center">
                                        <q-icon :name="ionTime" class="q-mr-xs" />
                                        {{ formatTimeDisplay(wishlist.start_time) }}
                                    </div>
                                </div>
                                <div class="column q-mx-sm"> ~ </div>
                                <div class="column">
                                    <span class="q-mb-xs">
                                        {{ formatDateDisplay(wishlist.end_date) }}
                                    </span>
                                    <span class="q-mb-xs">
                                        {{ formatTimeDisplay(wishlist.end_time) }}
                                    </span>
                                </div>
                            </div>
                        </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-item-label class="text-font">
                            {{ formatAmount(calcRentPrice(wishlist.start_date!, wishlist.end_date!,
            wishlist.car?.price!, wishlist.car?.deposit!)) }}
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <!-- if have nothing in wishlist -->
                <q-item v-else v-show="!isLoading">
                    <q-item-section align="center">Your wishlist is empty</q-item-section>
                </q-item>
            </q-scroll-area>
        </q-list>
    </q-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Wishlist } from '@/interfaces/rest/Wishlist';
import WishlistService from '@/services/wishlist.service';
import CryptoService from '@/services/crypto.service';
import { formatAmount, formatDateDisplay, formatTimeDisplay } from '@/composables/formatter';
import { ionCalendar, ionLocation, ionTime } from '@quasar/extras/ionicons-v6';
import WishlistDropdownSkeleton from '@/components/skeleton/WishlistDropdownSkeleton.vue';
import { calcRentPrice } from '@/composables/calculator';

const props = defineProps<{
    customerId: number;
}>();

const route = useRoute();
const router = useRouter();
const wishlists = ref<Wishlist[]>([]);
const height = ref<string>('48px');
const isLoading = ref<boolean>(false);

// computable height and max height of dropdown
const onResize: any = (size: any) => {
    height.value = size.height <= 300 ? `${size.height}px` : '300px';
}

function goToWishlist() {
    router.replace({ name: 'wishlist' });
}

function getWishlists() {
    isLoading.value = true;
    height.value = '48px';
    WishlistService.getByCustomerId(props.customerId)
        .then((response: any) => {
            // console.log(response);
            isLoading.value = false;
            wishlists.value = response.data;
        }).catch((e: Error) => {
            console.error(e);
            isLoading.value = false;
        });
}

function viewCar(carId: number) {
    console.log('id', carId);
    const encryptedId = CryptoService.encrypt(carId);
    router.push({ name: 'car-details', query: { cid: encryptedId } });

    if (route.fullPath.includes('cars/details')) {
        router.go(0);
    }
}
</script>