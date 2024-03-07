<template>
  <Header />
  <main>
    <h4>HiVe</h4>
    <p>promosipromosipromosi...</p>
    
    <CarSearchForm @on-submit="onSubmit" />
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/layouts/Header.vue'
import CarSearchForm from '@/components/forms/CarSearchForm.vue'

const router = useRouter();

const form: any = reactive({
  location: '',
  startDate: '',
  endDate: ''
});

function onSubmit() {
  if (form.location.value !== '' && form.startDate.value !== '' && form.endDate.value !== '') {
    console.log('form', form);
    router.push({ name: "cars" });
  }
}
</script>

<style>
.date-input {
  max-width: 300px;
}
</style>