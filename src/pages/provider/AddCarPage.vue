<template>
    <div class="q-pa-md">
        <q-card flat>
            <q-card-section>
                <div class="text-h6 q-mb-xl">Add Car</div>
                <CarDataForm></CarDataForm>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import CarDataForm from '@/components/forms/CarDataForm.vue'
</script>