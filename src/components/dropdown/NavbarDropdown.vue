<template>
    <q-menu transition-show="jump-down" transition-hide="jump-up">
        <q-list style="width: 220px">
            <q-item clickable v-close-popup @click="goToAccount">
                <q-item-section side>
                    <q-icon :name="ionPerson"></q-icon>
                </q-item-section>
                <q-item-section>Profil</q-item-section>
            </q-item>
            <q-item v-if="type == UserType.C" clickable v-close-popup @click="goToHistory">
                <q-item-section side>
                    <q-icon name="history"></q-icon>
                </q-item-section>
                <q-item-section>Riwayat</q-item-section>
            </q-item>
            <q-item v-if="type == UserType.C" clickable v-close-popup @click="handleProviderAuth">
                <q-item-section side>
                    <q-icon :name="ionStorefront"></q-icon>
                </q-item-section>
                <q-item-section>
                    {{ isProvider() ? 'Beranda Penyedia' : 'Jadi Penyedia Mobil' }}
                </q-item-section>
            </q-item>
            <q-item v-if="type == UserType.P" clickable v-close-popup @click="goToWithdraw">
                <q-item-section side>
                    <q-icon :name="ionCash"></q-icon>
                </q-item-section>
                <q-item-section>
                    <div>Saldo</div>
                    <div>{{ formatAmount(providerStore.getLoggedInUser.balance) }}</div>
                </q-item-section>
            </q-item>
            <q-item v-if="type == UserType.P" clickable v-close-popup @click="backToMain">
                <q-item-section>
                    Kembali ke HiVe
                </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="logout">
                <q-item-section side>
                    <q-icon :name="ionLogOut"></q-icon>
                </q-item-section>
                <q-item-section>
                    Keluar
                </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import type { Customer } from '@/interfaces/rest/Customer';
import type { Provider } from '@/interfaces/rest/Provider';
import { UserType } from '@/enums/enum';
import { ionLogOut, ionStorefront, ionPerson, ionCash } from '@quasar/extras/ionicons-v6';
import { formatAmount } from '@/composables/formatter';
import { useCustomerStore } from '@/stores/customer';
import { useProviderStore } from '@/stores/provider';
import userService from '@/services/user.service';

const props = defineProps<{
    user: Customer | Provider;
    type: UserType;
}>();

const emit = defineEmits<{
    openLoginDialog: []
}>();

const route = useRoute();
const router = useRouter();
const quasar = useQuasar();
const customerStore = useCustomerStore();
const providerStore = useProviderStore();

function isProvider() {
    if (props.type == UserType.C && (props.user as Customer).is_provider) {
        return true;
    }
    return false;
}

function goToAccount() {
    if (route.fullPath.includes('provider')) router.push({ name: 'provider-account' });
    else router.push({ name: 'account' });
}

function goToHistory() {
    router.push({ name: 'history' });
}

function goToWithdraw() {
    router.push({ name: 'withdraw' });
}

function handleProviderAuth() {
    if (!isProvider()) {
        router.push({ name: 'sign-up-prv' })
    } else if (localStorage.getItem(import.meta.env.VITE_PRV_SESSION_KEY) != null) {
        quasar.loading.show({ spinner: QSpinnerGears });
        setTimeout(() => {
            router.push({ name: 'dashboard' });
            quasar.loading.hide();
        }, 200);
    } else {
        emit('openLoginDialog');
    }
}

function logout() {
    quasar.loading.show({ spinner: QSpinnerGears });
    UserService.logout(props.type);
    customerStore.logout();
    providerStore.logout();
    setTimeout(() => {
        quasar.loading.hide();
        router.push({ name: 'logout' });
    }, 500);
}

function backToMain() {
    quasar.loading.show({ spinner: QSpinnerGears });
    setTimeout(() => {
        router.push({ name: 'home' });
        quasar.loading.hide();
    }, 200);
}
</script>