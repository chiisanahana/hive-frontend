<template>
    <q-layout view="hHh LpR fFf">
        <Header v-if="useHeader" />
        <ProviderSidebar v-if="usePrvDrawer" />

        <q-page-container>
            <RouterView />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import Header from '@/layouts/Header.vue';
import ProviderSidebar from '@/layouts/ProviderSidebar.vue';

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
const usePrvDrawer = computed(() => route.fullPath.includes('provider'));
</script>

<style>
.text-font {
    color: #43547E !important;
}
</style>
