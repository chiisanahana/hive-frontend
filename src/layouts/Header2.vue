<template>
    <q-toolbar class="bg-primary text-white">
        <a class="link" href="/">
            <img />
            <p class="text-h6 text-bold text-white">HIVE LOGO</p>
        </a>
        <q-space />

        <div v-if="isLoggedIn" class="q-pa-x-sm q-gutter-x-lg">
            <q-btn flat round dense :icon="ionCar" size="18px" />
            <q-btn flat round dense :icon="ionChatbubbleEllipses" />
            <q-btn flat round dense :icon="ionNotifications">
                <q-badge rounded color="red" floating transparent>
                    2
                </q-badge>
            </q-btn>
            <q-btn flat dense no-caps align="left" class="q-pa-md" style="min-width: 220px">
                <q-avatar size="32px" color="orange" class="q-mr-sm">
                    {{ user!.name?.charAt(0).toUpperCase() }}
                </q-avatar>
                <div>{{ user!.name }}</div>
                <q-menu transition-show="jump-down" transition-hide="jump-up">
                    <q-list style="width: 220px">
                        <q-item clickable v-close-popup>
                            <q-item-section side>
                                <q-icon :name="ionPerson"></q-icon>
                            </q-item-section>
                            <q-item-section>Account</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section side>
                                <q-icon :name="ionSettings"></q-icon>
                            </q-item-section>
                            <q-item-section>Settings</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="handleProviderAuth">
                            <q-item-section side>
                                <q-icon :name="ionStorefront"></q-icon>
                            </q-item-section>
                            <q-item-section>
                                {{ isProvider ? 'Owner Dashboard' : 'Be Our Provider' }}
                            </q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable v-close-popup @click="logout">
                            <q-item-section side>
                                <q-icon :name="ionLogOut"></q-icon>
                            </q-item-section>
                            <q-item-section>
                                Logout
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
        </div>
        <div v-else class="q-pa-sm q-gutter-md">
            <q-btn flat color="secondary" label="Log in" @click="loginDialog = true" />
            <q-btn to="/sign-up" unelevated color="secondary" text-color="accent" label="Sign up" />
        </div>
    </q-toolbar>
    <q-dialog v-model="loginDialog">
        <div>
            <LoginForm :user-type="loginUserType" :email="user?.email || ''" @post-action="loginSuccess"
                @route-to-sign-up="signUp" />
        </div>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar';
import CryptoService from '@/services/crypto.service';
import UserService from '@/services/user.service';
import { UserType } from '@/enums/enum';
import { ionCar, ionChatbubbleEllipses, ionLogOut, ionNotifications, ionStorefront, ionSettings, ionPerson } from '@quasar/extras/ionicons-v6';
import LoginForm from '@/components/forms/LoginForm.vue';

const route = useRoute();
const router = useRouter();
const quasar = useQuasar();
const isLoggedIn = ref<boolean>(false);
const user = ref<any>();
const isProvider = ref<boolean>();
const loginUserType = ref<UserType>(UserType.C);
const logoutUserType = ref<UserType>(UserType.C);
const loginDialog = ref<boolean>(false);

function getUserData() {
    const data = localStorage.getItem(import.meta.env.VITE_CUST_SESSION_KEY);
    if (data != null) {
        isLoggedIn.value = true;
        user.value = JSON.parse(CryptoService.decrypt(data));
        console.log('user', user.value);
        isProvider.value = user.value.is_provider;
    }
}

function loginSuccess() {
    loginDialog.value = false;
    getUserData();

    // if login provider, redirect to dashboard page
    if (loginUserType.value == UserType.P) {
        router.push({ name: 'dashboard' });
    }
}

function signUp() {
    router.push({ name: 'sign-up' });
}

function handleProviderAuth() {
    if (isProvider.value) {
        loginUserType.value = UserType.P;
        loginDialog.value = true;
    } else {
        router.push({ name: 'sign-up-prv' })
    }
}

function logout() {
    quasar.loading.show({ spinner: QSpinnerGears });
    if (route.fullPath.includes('/provider')) logoutUserType.value = UserType.P;

    setTimeout(() => {
        UserService.logout(logoutUserType.value);
        router.push({ name: 'logout' });
        quasar.loading.hide();
    }, 500);
}

onMounted(() => {
    getUserData();
});
</script>

<style>
.link {
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
}
</style>