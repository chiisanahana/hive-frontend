<template>
    <Breadcrumb :items="breadcrumbItems" />

    <div class="q-ma-md">
        <p class="text-h4">Edit Car</p>
        <div>{{ car }}</div>
        <CarDataForm></CarDataForm>
    </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@/interfaces/BreadcrumbItem';
import type { Car } from '@/interfaces/rest/Car';
import { ref, onMounted } from 'vue'
import { useCarStore } from '@/stores/car';
import Breadcrumb from '@/layouts/Breadcrumb.vue';
import CarDataForm from '@/components/forms/CarDataForm.vue';

const breadcrumbItems: BreadcrumbItem[] = [
    { icon: 'home', ref: '/' },
    { label: 'Manage Cars', ref: '/manage-cars' },
    { label: 'Edit Car' }
]
const store = useCarStore();
const car = ref<Car>();

onMounted(() => {
    car.value = store.getCarToEdit;
});
</script>