<template>
  <div class="q-mt-xl">
    <CarSearchForm :routeTo="'cars'" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import CarSearchForm from '@/components/forms/CarSearchForm.vue';

const quasar = useQuasar();

onBeforeMount(() => {
  quasar.loading.hide();
});
</script>