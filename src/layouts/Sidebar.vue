<template>
    <div class="row">
        <div class="q-pt-md col-2 bg-secondary">
            <q-layout-header>
                <q-toolbar>
                    <q-avatar size="32px" color="orange" class="q-mr-md"></q-avatar>
                    <q-toolbar-title align="left">{{user?.name}}</q-toolbar-title>
                </q-toolbar>
            </q-layout-header>
            <q-card-actions vertical class="">
                <q-btn flat dense no-caps align="left" class="q-pa-md">
                    <q-icon :name="ionHome" />
                    <div>Home</div>
                </q-btn>
                <q-btn flat dense no-caps align="left" class="q-pa-md">
                    <q-icon :name="ionChatbubbleEllipses" />
                    Chat
                </q-btn>
                <q-btn flat dense no-caps align="left" class="q-pa-md">
                    <q-icon :name="ionCar" />
                    Cars
                    <q-menu transition-show="jump-down" transition-hide="jump-up">
                        <q-list style="width: 220px">
                            <q-item clickable v-close-popup>
                                <q-item-section side>
                                </q-item-section>
                                <q-item-section>Add Car</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section side>
                                </q-item-section>
                                <q-item-section>All Car</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
                <q-btn flat dense no-caps align="left" class="q-pa-md">
                    <q-icon><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /></q-icon>
                    Orders
                    <q-menu transition-show="jump-down" transition-hide="jump-up">
                        <q-list style="width: 220px">
                            <q-item clickable v-close-popup>
                                <q-item-section side>
                                </q-item-section>
                                <q-item-section>Pending Approval</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section side>
                                </q-item-section>
                                <q-item-section>Ongoing</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section side>
                                </q-item-section>
                                <q-item-section>Completed</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup>
                                <q-item-section side>
                                </q-item-section>
                                <q-item-section>Rejected</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </q-card-actions>
        </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CryptoService from '@/services/crypto.service';
import type { Provider } from '@/interfaces/rest/Provider';
import Header from '@/layouts/Header.vue';
import { ionCar, ionChatbubbleEllipses, ionHome } from '@quasar/extras/ionicons-v6';

const route = useRoute();
const router = useRouter();
const user = ref<Provider | null>(null);

function getUserData(){
    const data = localStorage.getItem(import.meta.env.VITE_PRV_SESSION_KEY)
    user.value = JSON.parse(CryptoService.decrypt(data!));
    console.log("Data: " + data)
    console.log('user', user.value);
}

onMounted(() => {
    getUserData();
});
</script>