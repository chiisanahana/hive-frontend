<template>
    <q-menu transition-show="jump-down" transition-hide="jump-up">
        <q-list style="width: 220px">
            <q-item clickable v-close-popup @click="goToAccount">
                <q-item-section side>
                    <q-icon :name="ionPerson"></q-icon>
                </q-item-section>
                <q-item-section>Account</q-item-section>
            </q-item>
            <q-item v-if="type == UserType.C" clickable v-close-popup @click="goToHistory">
                <q-item-section side>
                    <q-icon name="history"></q-icon>
                </q-item-section>
                <q-item-section>History</q-item-section>
            </q-item>
            <q-item v-if="type == UserType.C" clickable v-close-popup @click="handleProviderAuth">
                <q-item-section side>
                    <q-icon :name="ionStorefront"></q-icon>
                </q-item-section>
                <q-item-section>
                    {{ isProvider() ? 'Owner Dashboard' : 'Be Our Provider' }}
                </q-item-section>
            </q-item>
            <q-item v-else clickable v-close-popup @click="backToMain">
                <q-item-section>
                    Back To HiVe
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import type { Customer } from '@/interfaces/rest/Customer';
import type { Provider } from '@/interfaces/rest/Provider';
import { UserType } from '@/enums/enum';
import { ionLogOut, ionStorefront, ionPerson } from '@quasar/extras/ionicons-v6';

const props = defineProps<{
    user: Customer | Provider;
    type: UserType;
}>();

const emit = defineEmits<{
    openLoginDialog: []
}>();

const router = useRouter();
const quasar = useQuasar();

function isProvider() {
    if (props.type == UserType.C && (props.user as Customer).is_provider) {
        return true;
    }
    return false;
}

function goToAccount() {
    router.push({ name: 'account' });
}

function goToHistory() {
    router.push({ name: 'history' });
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
    setTimeout(() => {
        UserService.logout(props.type);
        router.push({ name: 'logout' });
        quasar.loading.hide();
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