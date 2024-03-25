<template>
    <q-drawer show-if-above :width="250" :breakpoint="700">
        <q-scroll-area class="fit">
            <q-list>
                <q-item clickable :active="isActive('')" active-class="text-accent" @click="goToDashboard">
                    <q-item-section side>
                        <q-icon class="menu-icon" :color="isActive('') ? 'accent' : 'font'" :name="ionHome"></q-icon>
                    </q-item-section>
                    <q-item-section>Dashboard</q-item-section>
                </q-item>
                <q-item clickable :active="isActive('chat')" active-class="text-accent" @click="goToChat">
                    <q-item-section side>
                        <q-icon class="menu-icon" :color="isActive('chat') ? 'accent' : 'font'"
                            :name="ionChatbubbleEllipses"></q-icon>
                    </q-item-section>
                    <q-item-section>Chat</q-item-section>
                </q-item>

                <q-expansion-item :icon="ionCar" label="Cars" :expand-icon="ionChevronDown"
                    :header-class="isActive('cars') ? 'text-accent' : ''" default-opened>
                    <q-list>
                        <q-item dense clickable :active="isActive('cars/add')" active-class="text-accent" @click="goToAddCar">
                            <q-item-section class="child-menu">Add cars</q-item-section>
                        </q-item>
                    </q-list>
                    <q-list>
                        <q-item dense clickable :active="isActive('cars', true)" active-class="text-accent"
                            @click="goToManageCars">
                            <q-item-section class="child-menu">Manage cars</q-item-section>
                        </q-item>
                    </q-list>
                </q-expansion-item>
                <q-expansion-item :icon="ionReader" label="Orders" :expand-icon="ionChevronDown" default-opened>
                    <q-list>
                        <q-item dense clickable :active="isActive('orders')" active-class="text-accent">
                            <q-item-section class="child-menu">Pending approval</q-item-section>
                        </q-item>
                    </q-list>
                    <q-list>
                        <q-item dense clickable :active="isActive('orders')" active-class="text-accent">
                            <q-item-section class="child-menu">Ongoing</q-item-section>
                        </q-item>
                    </q-list>
                    <q-list>
                        <q-item dense clickable :active="isActive('orders')" active-class="text-accent">
                            <q-item-section class="child-menu">Completed</q-item-section>
                        </q-item>
                    </q-list>
                </q-expansion-item>


            </q-list>
        </q-scroll-area>
    </q-drawer>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ionCar, ionChatbubbleEllipses, ionChevronDown, ionHome, ionReader } from '@quasar/extras/ionicons-v6';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();

function isActive(path: string, fullPath?: boolean) {
    if (fullPath)
        return route.fullPath == '/provider/' + path;
    if (path == '') 
        return route.fullPath == '/provider';
    return route.fullPath.includes(path);
}

function goToDashboard() {
    router.push({ name: 'dashboard' });
}

function goToChat() {

}

function goToManageCars() {
    router.push({ name: 'view-cars' });
}

function goToAddCar() {
    router.push({ name: 'add-car' });
}

</script>

<style scoped>
.child-menu {
    padding-left: 56px;
}
</style>

<style>
.q-item__section:has(.menu-icon) {
    width: 56px;
}
</style>