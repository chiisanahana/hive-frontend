<template>
    <Header />
    <h4>Car Details</h4>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <p>{{ car }}</p>
    </transition>
    <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { Car } from "@/interfaces/Car";
import CarService from "@/services/car.service";
import CryptoService from '@/services/crypto.service';
import Header from '@/layouts/Header.vue'

const route = useRoute();
// const router = useRouter();
const car = ref<Car>();
const visible = ref<boolean>(false);

function getCar(carId: number | string) {
    CarService.get(carId).then((response: any) => {
        console.log(response);
        visible.value = false;
        car.value = response.data;
    }).catch((e: Error) => {
        console.error(e);
    });
}

onMounted(() => {
    visible.value = true
    const carId = route.query.cid;
    console.log(carId);
    if (typeof carId === 'string') {
        const decryptedId = CryptoService.decrypt(carId);
        console.log("get car data " + carId + " - " + decryptedId);
        getCar(decryptedId);
    }
})
</script>