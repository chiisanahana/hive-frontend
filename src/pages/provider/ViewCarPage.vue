<template>
    <Breadcrumb :items="breadcrumbItems" />

    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="q-pa-md row q-gutter-md">
            <q-card class="car-card col-3" v-for="car in cars" :key="car.id">
                <img
                    src="https://daihatsu.co.id/cdn-cgi/image/width=720/https://cms-headless.daihatsu.co.id/assets/bf37106f-5b63-422e-bd34-97d85b5ef068" />
                <q-card-section>
                    <div class="text-h6">{{ car.brand }}</div>
                    <div class="text-subtitle2">{{ car.price }}</div>
                </q-card-section>
                <q-separator />
                <q-card-actions>
                    <q-btn flat @click="editCar(car)">Edit</q-btn>
                    <q-btn flat @click="showConfirm = true; selectedCar = car.id">Delete</q-btn>
                </q-card-actions>
            </q-card>
            <ConfirmDialog v-model="showConfirm" message="Are you sure want to delete this car?"
                action-btn-title="Delete" @confirm-action="deleteCar(selectedCar!)" />
        </div>
    </transition>
    <div class="q-pa-md row justify-end">
        <q-btn round color="primary" :icon="ionAdd" :to="{ name: 'add-car' }" />
    </div>
    <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { BreadcrumbItem } from '@/interfaces/BreadcrumbItem';
import type { Car } from '@/interfaces/rest/Car';
import { useCarStore } from '@/stores/car';
import CarService from '@/services/car.service';
import Header from '@/layouts/Header.vue';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { ionAdd } from '@quasar/extras/ionicons-v6';

const breadcrumbItems: BreadcrumbItem[] = [
    { icon: 'home', ref: '/' },
    { label: 'Manage Cars' }
]
const router = useRouter();
const store = useCarStore();
const cars = ref<Car[]>([]);
const visible = ref<boolean>(false);
const showConfirm = ref<boolean>(false);
const selectedCar = ref<number>();

function getCars() {
    CarService.getAll().then((response: any) => {
        console.log(response);
        visible.value = false;
        cars.value = response.data;
    }).catch((e: Error) => {
        console.error(e);
    });
}

function editCar(car: Car) {
    console.log('Edit car with id ' + car.id);
    store.setCarToEdit(car);
    router.push({ name: 'edit-car' });
};

function deleteCar(id: number) {
    console.log('Delete car with id ' + id);
    CarService.delete(id).then((response: any) => {
        console.log(response);
        getCars();
    }).catch((e: Error) => {
        console.error(e);
    });
}

onMounted(() => {
    visible.value = true
    getCars();
})
</script>