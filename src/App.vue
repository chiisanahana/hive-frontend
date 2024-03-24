<template>
    <q-layout view="hHh lpR fFf">
        <Header v-if="useHeader" />
        <q-page-container>
            <RouterView />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, RouterView } from 'vue-router'
import Header from '@/layouts/Header.vue'

const route = useRoute();
const noHeader = ref<string[]>([
    '/login', 
    '/sign-up', 
    '/provider/login', 
    '/provider/sign-up',
    '/logout',
    '/not-found'
]);
const useHeader = computed(() => !noHeader.value.includes(route.fullPath));
</script>

<style>
.text-font {
    color: #43547E !important;
}
</style>
