<template>
    <h4>View Car</h4>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="q-pa-md row q-gutter-md">
            <q-card class="car-card" v-for="car in cars" :key="car.id">
                <q-card-section>
                    {{ car }}
                </q-card-section>
                <q-separator />
                <q-card-actions>
                    <q-btn flat @click="editCar(car)">Edit</q-btn>
                    <q-btn flat @click="showConfirm = true; selectedCar = car.id">Delete</q-btn>
                </q-card-actions>
            </q-card>
            <ConfirmDialog v-model="showConfirm" message="Are you sure want to delete this car?" action-btn-title="Delete"
                @confirm-action="deleteCar(selectedCar ?? '')" />
        </div>
    </transition>
    <div class="q-pa-md row justify-end">
        <q-btn round color="primary" icon="add" :to="{ name: 'add-car' }" />
    </div>
    <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import type { Car } from "@/interfaces/Car";
import CarService from "@/services/car.service";
import ConfirmDialog from "@/components/dialog/ConfirmDialog.vue";
import { useCarStore } from "@/stores/car";

const router = useRouter();
const store = useCarStore();
const cars = ref<Car[]>([]);
const visible = ref<boolean>(false);
const showConfirm = ref<boolean>(false);
const selectedCar = ref<number | string>();

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
    console.log("Edit car with id " + car.id);
    store.storeToEdit(car);
    router.push({ name: "edit-car" });
};

function deleteCar(id: number | string) {
    console.log("Delete car with id " + id);
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