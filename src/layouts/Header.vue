<template>
    <q-header>
        <q-toolbar class="bg-white text-primary">
            <a class="q-pa-sm row link cursor-pointer" @click="goToHome">
                <img :src="logo" height="44px" />
            </a>
            <q-space />

            <div v-if="isLoggedIn" class="q-pa-x-sm q-gutter-x-lg">
                <q-btn v-if="currentUser == UserType.C" flat round dense :icon="ionCar" size="18px">
                    <WishlistDropdown :customerId="user!.id" />
                </q-btn>
                <q-btn v-if="currentUser == UserType.C" flat round dense :icon="ionChatbubbleEllipses">
                    <ChatDropdown :customerId="user!.id" />
                </q-btn>
                <q-btn flat round dense :icon="ionNotifications">
                    <NotifDropdown :customerId="user!.id" />
                    <!-- <q-badge rounded color="red" floating transparent>
                        2
                    </q-badge> -->
                </q-btn>
                <q-btn flat dense no-caps align="left" class="gt-xs"
                    :class="currentUser == UserType.C ? 'q-pa-md' : 'q-pa-sm'" style="min-width: 220px" >
                    <q-avatar v-if="user?.profile_picture != null" class="q-mr-md">
                        <img :src="getProfPict(user)">
                    </q-avatar>
                    <q-avatar v-else color="orange" class="q-mr-md text-white">
                        {{ user!.name?.charAt(0).toUpperCase() }}
                    </q-avatar>
                    <div class="column align-left justify-start">
                        <div class="text-left text-font">{{ currentUser == UserType.C ? user!.name : (user as
                            Provider)!.trading_name
                            }}</div>
                        <div v-if="currentUser == UserType.P" class="text-left text-caption text-blue-grey-4">
                            {{ user!.name }}
                        </div>
                    </div>
                    <NavbarDropdown :user="user!" :type="currentUser!" @open-login-dialog="openLoginDialog" @check-prv-update="getUserData" />
                </q-btn>
                <q-btn flat dense no-caps align="left" class="lt-sm q-ml-xs"
                    :class="currentUser == UserType.C ? 'q-pa-md' : 'q-pa-sm'">
                    <q-avatar v-if="user?.profile_picture != null">
                        <img :src="getProfPict(user)">
                    </q-avatar>
                    <q-avatar v-else color="orange" class="text-white">
                        {{ user!.name?.charAt(0).toUpperCase() }}
                    </q-avatar>
                    <NavbarDropdown :user="user!" :type="currentUser!" @open-login-dialog="openLoginDialog"
                        @check-prv-update="getUserData" />
                </q-btn>
            </div>
            <div v-else class="q-pa-sm q-gutter-md">
                <q-btn unelevated color="secondary" text-color="accent" label="Log in" @click="openLoginDialog" />
                <q-btn unelevated color="primary" label="Sign up" to="/sign-up" />
            </div>
        </q-toolbar>
    </q-header>
    <q-dialog v-model="loginDialog">
        <div>
            <LoginForm :user-type="getLoginUserType()" :email="user?.email || ''" @post-action="loginSuccess"
                @route-to-sign-up="signUp" />
        </div>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CryptoService from '@/services/crypto.service';
import type { Provider } from '@/interfaces/rest/Provider';
import type { Customer } from '@/interfaces/rest/Customer';
import { UserType } from '@/enums/enum';
import { ionCar, ionChatbubbleEllipses, ionNotifications } from '@quasar/extras/ionicons-v6';
import LoginForm from '@/components/forms/LoginForm.vue';
import NavbarDropdown from '@/components/dropdown/NavbarDropdown.vue';
import WishlistDropdown from '@/components/dropdown/WishlistDropdown.vue';
import ChatDropdown from '@/components/dropdown/ChatDropdown.vue';
import NotifDropdown from '@/components/dropdown/NotifDropdown.vue';
import { getProfPict } from '@/composables/getter';
import logo from '@/assets/images/logo.png';

const route = useRoute();
const router = useRouter();
const user = ref<Customer | Provider | null>(null);
const currentUser = ref<UserType | null>(null);
const loginDialog = ref<boolean>(false);
const isLoggedIn = computed<boolean>(() => user.value != null);

watch(
    () => route.fullPath, async () => { getUserData(); }
)

function getUserData() {
    if (route.fullPath.includes('/provider')) {
        const data = localStorage.getItem(import.meta.env.VITE_PRV_SESSION_KEY);
        if (data != null) {
            user.value = JSON.parse(CryptoService.decrypt(data));
            currentUser.value = UserType.P;
        }
    } else {
        const data = localStorage.getItem(import.meta.env.VITE_CUST_SESSION_KEY);
        if (data != null) {
            user.value = JSON.parse(CryptoService.decrypt(data));
            currentUser.value = UserType.C;
        }
    }
}

function getLoginUserType() {
    return currentUser.value == null ? UserType.C : UserType.P;
}

function loginSuccess() {
    loginDialog.value = false;

    // if login provider, redirect to dashboard page
    if (getLoginUserType() == UserType.P) {
        router.push({ name: 'dashboard' });
    }
    getUserData();
}

function signUp() {
    router.push({ name: 'sign-up' });
}

function openLoginDialog() {
    loginDialog.value = true;
}

function goToHome() {
    router.push({ name: 'home' });
}

onMounted(() => {
    getUserData();
});
</script>

<style scoped>
.link {
    text-decoration: none;
    font-weight: 500;
}
</style>