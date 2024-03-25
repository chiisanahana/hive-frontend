<template>
    <div class="q-ma-md">
        <p class="text-h4">Edit Car</p>
        <div>{{ car }}</div>
        <CarDataForm></CarDataForm>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar';
import type { Car } from '@/interfaces/rest/Car';
import CarService from '@/services/car.service';
import CryptoService from '@/services/crypto.service';
import CarDataForm from '@/components/forms/CarDataForm.vue';

const route = useRoute();
const quasar = useQuasar();
const car = ref<Car>();

function getCar(carId: number) {
    quasar.loading.show({ spinner: QSpinnerGears });
    CarService.get(carId).then((response: any) => {
        car.value = response.data;
        quasar.loading.hide();
    }).catch((e: Error) => {
        console.error(e);
        quasar.loading.hide();
    });
}

onBeforeMount(() => {
    // load car data
    const carId = route.query.cid;
    if (typeof carId === 'string') {
        getCar(parseInt(CryptoService.decrypt(carId)));
    }
});
</script>