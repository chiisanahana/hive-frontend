<template>
    <div>{{ car }}</div>
</template>

<script setup lang="ts">
import type { Car } from "@/interfaces/Car";
import { ref, onMounted } from "vue"
import { useCarStore } from "@/stores/car";

const store = useCarStore();
const car = ref<Car>();

onMounted(() => {
    car.value = store.getCarToEdit;
});
</script>