<template>
    <q-card flat bordered :v-ripple="!isExpired()" :class="isExpired() ? 'q-mb-md disabled' : 'q-mb-md cursor-pointer'"
        @click="viewCar">
        <q-card-section class="q-pa-sm">
            <div class="row">
                <div class="column justify-center q-mr-lg">
                    <img width="120px" class="rounded-borders"
                        :src="getCarImg(props.wishlist?.car?.car_files[0] || null)" />

                </div>
                <div class="column q-gutter-xs">
                    <div class="text-body1 text-bold">{{ props.wishlist?.car?.brand }}</div>
                    <div class="row items-center">
                        <q-icon :name="ionLocation" class="q-mr-xs" />
                        {{ getLocation() }}
                    </div>
                    <div class="row">
                        <div class="column">
                            <div class="row items-center q-mb-xs">
                                <q-icon :name="ionCalendar" class="q-mr-xs" />
                                {{ formatDateDisplay(wishlist?.start_date) }}
                            </div>
                            <div class="row items-center">
                                <q-icon :name="ionTime" class="q-mr-xs" />
                                {{ formatTimeDisplay(wishlist?.start_time) }}
                            </div>
                        </div>
                        <div class="column q-mx-sm"> ~ </div>
                        <div class="column">
                            <span class="q-mb-xs">
                                {{ formatDateDisplay(wishlist?.end_date) }}
                            </span>
                            <span class="q-mb-xs">
                                {{ formatTimeDisplay(wishlist?.end_time) }}
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
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import type { Wishlist } from '@/interfaces/rest/Wishlist';
import CryptoService from '@/services/crypto.service';
import { formatAmount, formatDateDisplay, formatTimeDisplay, formatTimestampToDate, formatTimestampToDateDisplay } from '@/composables/formatter';
import { ionCalendar, ionLocation, ionTime } from '@quasar/extras/ionicons-v6';
import { calcRentPrice } from '@/composables/calculator';
import { getCarImg } from '@/composables/getter';

const props = defineProps<{
    wishlist: Wishlist | undefined
}>();
const router = useRouter();
const totalPrice = ref<number>(0);

function getLocation() {
    return props?.wishlist?.car?.provider?.city + ', ' + props?.wishlist?.car?.provider?.province;
}

function isExpired() {
    // console.log(props.wishlist?.id! + '-' + (date.getDateDiff(Date.parse(props.wishlist?.start_date!), new Date(), 'hours') < 0))
    return date.getDateDiff(Date.parse(props.wishlist?.start_date!), new Date(), 'hours') < 0;
}

function viewCar() {
    if (!isExpired()) {
        const encryptedId = CryptoService.encrypt(props.wishlist?.car?.id);
        router.push({ name: 'car-details', query: { cid: encryptedId } });
    }
}

onMounted(() => {
    totalPrice.value = calcRentPrice(
        props.wishlist?.start_date!, props.wishlist?.end_date!,
        props.wishlist?.car?.price!, props.wishlist?.car?.deposit!);

});
</script>