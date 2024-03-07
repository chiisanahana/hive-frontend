<template>
    <Header />
    <Breadcrumb :items="breadcrumbItems" />

    <div class="q-ma-md">
        <p class="text-h4">Add Car</p>
        <CarDataForm></CarDataForm>
    </div>
</template>

<script setup lang="ts">
import Header from '@/layouts/Header.vue'
import Breadcrumb from '@/layouts/Breadcrumb.vue'
import CarDataForm from '@/components/forms/CarDataForm.vue'
import type { BreadcrumbItem } from '@/interfaces/BreadcrumbItem';

const breadcrumbItems: BreadcrumbItem[] = [
    { icon: 'home', ref: '/' },
    { label: 'Manage Cars', ref: '/manage-cars' },
    { label: 'Add Car' }
]
</script>