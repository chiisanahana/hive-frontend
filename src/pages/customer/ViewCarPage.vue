<template>
    <Header />

    <CarSearchForm @on-submit="onSubmit" />

    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="row">
            <!-- sidebar -->
            <div class="q-pt-md col-2">
                <q-scroll-area style="height: 200px; max-width: 300px;" class="bg-secondary">
                    <div class="q-py-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                    </div>
                </q-scroll-area>
            </div>

            <!-- content -->
            <div class="q-pa-md row col-10 q-gutter-md">
                <q-card v-ripple class="car-card col-3" v-for="car in cars" :key="car.id" @click="clickCard(car.id)">
                    <img
                        src="https://daihatsu.co.id/cdn-cgi/image/width=720/https://cms-headless.daihatsu.co.id/assets/bf37106f-5b63-422e-bd34-97d85b5ef068" />
                    <q-card-section>
                        <div class="text-h6">{{ car.brand }}</div>
                        <div class="text-subtitle2">Rp{{ car.price }}/day</div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </transition>
    <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Car } from '@/interfaces/rest/Car';
import CarService from '@/services/car.service';
import CryptoService from '@/services/crypto.service';
import Header from '@/layouts/Header.vue';
import CarSearchForm from '@/components/forms/CarSearchForm.vue';

const router = useRouter();
const cars = ref<Car[]>([]);
const visible = ref<boolean>(false);

function getCars() {
    CarService.getAll().then((response: any) => {
        console.log(response);
        visible.value = false;
        cars.value = response.data;
    }).catch((e: Error) => {
        console.error(e);
    });
}

function clickCard(id: any) {
    const encryptedId = CryptoService.encrypt(id);
    console.log('card clicked ' + id + ' - ' + encryptedId);
    router.push({ name: 'car-details', query: { cid: encryptedId } });
}

function onSubmit() {
    console.log("submit");
}

onMounted(() => {
    visible.value = true
    getCars();
})
</script>@/interfaces/rest/Car