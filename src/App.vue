<template>
    <q-layout view="hHh LpR fff">
        <Header v-if="useHeader" />
        <ProviderSidebar v-if="usePrvDrawer" />

        <q-page-container>
            <RouterView />
        </q-page-container>

        <Footer v-if="mounted && useFooter" />
    </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import Header from '@/layouts/Header.vue';
import Footer from '@/layouts/Footer.vue';
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
const noDrawer = ref<string[]>([
    '/provider/login',
    '/provider/sign-up',
])
const useHeader = computed(() => !noHeader.value.includes(route.fullPath));
const useFooter = computed(() => route.fullPath == '/' || route.fullPath == '/faq');
const usePrvDrawer = computed(() => route.fullPath.includes('provider') && !noDrawer.value.includes(route.fullPath));
const mounted = ref<boolean>(false);

onMounted(() => {
    setTimeout(() => {
        mounted.value = true;
    }, 100);
})
</script>

<style>
.text-font {
    color: #43547E !important;
}
</style>
