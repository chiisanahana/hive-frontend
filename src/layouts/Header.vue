<template>
    <q-header>
        <q-toolbar class="bg-white text-primary">
            <a class="q-pa-sm row link cursor-pointer" @click="goToHome">
                <img :src="logo" height="44px" />
            </a>
            <q-space />

            <div v-if="isLoggedIn && customerStore.getLoggedInUser" class="q-pa-x-sm q-gutter-x-lg">
                <q-btn v-if="currentUser == UserType.C" flat round dense :icon="ionCar" size="18px">
                    <WishlistDropdown :customerId="customerStore.getLoggedInUser.id" />
                </q-btn>
                <q-btn v-if="currentUser == UserType.C" flat round dense :icon="ionChatbubbleEllipses">
                    <ChatDropdown :customerId="customerStore.getLoggedInUser.id" />
                </q-btn>
                <q-btn v-if="currentUser" flat round dense :icon="ionNotifications">
                    <NotifDropdown
                        :userId="currentUser == UserType.C ? customerStore.getLoggedInUser.id : providerStore.getLoggedInUser.id"
                        :type="currentUser" />
                    <q-badge v-if="notifStore.getUnreadCount > 0" rounded color="red" floating transparent>
                        {{ notifStore.getUnreadCount }}
                    </q-badge>
                </q-btn>
                <q-btn flat dense no-caps align="left" class="gt-xs"
                    :class="currentUser == UserType.C ? 'q-pa-md' : 'q-pa-sm'" style="min-width: 220px">
                    <q-avatar v-if="(currentUser == UserType.C && customerStore.getLoggedInUser.profile_picture) ||
                        (currentUser == UserType.P && providerStore.getLoggedInUser.profile_picture)" class="q-mr-md">
                        <img
                            :src="getProfPict(currentUser == UserType.C ? customerStore.getLoggedInUser : providerStore.getLoggedInUser)">
                    </q-avatar>
                    <q-avatar v-else color="orange" class="q-mr-md text-white">
                        {{ currentUser == UserType.C ? customerStore.getLoggedInUser.name.charAt(0).toUpperCase() :
                            providerStore.getLoggedInUser.trading_name?.charAt(0).toUpperCase() }}
                    </q-avatar>
                    <div class="column align-left justify-start">
                        <div v-if="user" class="text-left text-font">
                            {{ currentUser == UserType.C ?
                                customerStore.getLoggedInUser.name : providerStore.getLoggedInUser.trading_name
                            }}
                        </div>
                        <div v-if="user && currentUser == UserType.P" class="text-left text-caption text-blue-grey-4">
                            {{ providerStore.getLoggedInUser.name }}
                        </div>
                    </div>
                    <NavbarDropdown v-if="user && currentUser" :user="user" :type="currentUser"
                        @open-login-dialog="openLoginDialog" @check-prv-update="getUserData" />
                </q-btn>
                <q-btn flat dense no-caps align="left" class="lt-sm q-ml-xs"
                    :class="currentUser == UserType.C ? 'q-pa-md' : 'q-pa-sm'">
                    <q-avatar v-if="(currentUser == UserType.C && customerStore.getLoggedInUser.profile_picture) ||
                        (currentUser == UserType.P && providerStore.getLoggedInUser.profile_picture)" class="q-mr-md">
                        <img
                            :src="getProfPict(currentUser == UserType.C ? customerStore.getLoggedInUser : providerStore.getLoggedInUser)">
                    </q-avatar>
                    <q-avatar v-else color="orange" class="text-white">
                        {{ currentUser == UserType.C ? customerStore.getLoggedInUser.name.charAt(0).toUpperCase() :
                            providerStore.getLoggedInUser.trading_name?.charAt(0).toUpperCase() }}
                    </q-avatar>
                    <NavbarDropdown v-if="user && currentUser" :user="user" :type="currentUser"
                        @open-login-dialog="openLoginDialog" />
                </q-btn>
            </div>
            <div v-else class="q-pa-sm q-gutter-md">
                <q-btn unelevated color="secondary" text-color="accent" label="Masuk" @click="openLoginDialog" />
                <q-btn unelevated color="primary" label="Daftar" to="/sign-up" />
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
import { useCustomerStore } from '@/stores/customer';
import { useProviderStore } from '@/stores/provider';
import { useNotifStore } from '@/stores/notif';
import NotificationService from '@/services/notification.service';

const route = useRoute();
const router = useRouter();
const user = ref<Customer | Provider | null>(null);
const currentUser = ref<UserType | null>(null);
const loginDialog = ref<boolean>(false);
const isLoggedIn = computed<boolean>(() => user.value != null);
const customerStore = useCustomerStore();
const providerStore = useProviderStore();
const notifStore = useNotifStore();

watch(
    () => route.fullPath, async () => { getUserData(); }
)

function getUserData() {
    if (route.fullPath.includes('/provider')) {
        if (providerStore.getLoggedInUser != null) {
            user.value = providerStore.getLoggedInUser;
            currentUser.value = UserType.P;

            NotificationService.get(providerStore.getLoggedInUser.id, UserType.P)
                .then((response) => {
                    notifStore.setNotif(response.data);
                });
        }
    } else {
        if (customerStore.getLoggedInUser != null) {
            user.value = customerStore.getLoggedInUser;
            currentUser.value = UserType.C;

            NotificationService.get(user.value!.id, UserType.C)
                .then((response) => {
                    notifStore.setNotif(response.data);
                });
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