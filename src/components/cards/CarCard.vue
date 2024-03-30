<template>
    <q-card v-ripple class="car-card col-md-3 col-sm-6 cursor-pointer relative-position" @click="viewCar">
        <q-img v-if="car != undefined && car.car_files.length > 0" :src="getCarImg(car.car_files[0] || null)" :ratio="16 / 9" />
        <q-card-section>
            <div class="text-body1 text-bold">{{ car?.brand }}</div>
            <div class="row">
                <div class="text-body2">
                    {{ formatAmount(car?.price) }}
                    <span class="text-blue-grey-4">/day</span>
                </div>
                <q-space />
                <div v-if="car?.rating != undefined && car.rating > 0" class="row items-center">
                    <q-icon name="r_star" size="xs" color="warning" class="q-mr-xs" />
                    <span class="text-bold">{{ car?.rating }}</span>
                </div>
            </div>
            <div class="row q-gutter-md q-mt-xs">
                <div class="row items-center text-blue-grey-4">
                    <q-icon size="xs" class="q-mr-xs">
                        <img :src="chairAlt" class="icon">
                    </q-icon>
                    {{ car?.seat }} seats
                </div>
                <div class="row items-center text-blue-grey-4">
                    <q-icon size="xs" class="q-mr-xs">
                        <img :src="autoTransmission" class="icon">
                    </q-icon>
                    {{ car?.transmission }}
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">

import { useRouter } from 'vue-router';
import type { Car } from '@/interfaces/rest/Car';
import CryptoService from '@/services/crypto.service';
import { formatAmount } from '@/composables/formatter';
import { getCarImg } from '@/composables/getter';
import autoTransmission from '@/assets/icons/auto_transmission.svg';
import chairAlt from '@/assets/icons/chair_alt.svg';

const props = defineProps<{
    car: Car | undefined
}>();
const router = useRouter();

function viewCar() {
    if (props.car != undefined) {
        const encryptedId = CryptoService.encrypt(props.car.id);
        router.push({ name: 'car-details', query: { cid: encryptedId } });
    }
}
</script>