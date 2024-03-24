<template>
  <main>
    <p>promosipromosipromosi...</p>
    <p>promosipromosipromosi...</p>
    <p>promosipromosipromosi...</p>
    <p>promosipromosipromosi...</p>

    <CarSearchForm :routeTo="'cars'" />
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import CarSearchForm from '@/components/forms/CarSearchForm.vue';
import type { Customer } from '@/interfaces/rest/Customer';

const router = useRouter();
const quasar = useQuasar();
const user = ref<Customer>();

const form: any = reactive({
  location: '',
  startDate: '',
  endDate: ''
});

// function onSubmit() {
//   if (form.location.value !== '' && form.startDate.value !== '' && form.endDate.value !== '') {
//     console.log('form', form);
//     router.push({ name: "cars" });
//   }
// }

onBeforeMount(() => {
  quasar.loading.hide();
});
</script>

<style scoped>
.date-input {
  max-width: 300px;
}
</style>