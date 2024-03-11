<template>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import type { Customer } from '@/interfaces/rest/Customer';
import type { Provider } from '@/interfaces/rest/Provider';
import { UserType } from '@/enums/enum';
import { ionLogOut, ionStorefront, ionSettings, ionPerson } from '@quasar/extras/ionicons-v6';

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

function handleProviderAuth() {
    if (!isProvider()) {
        console.log('!isProvider');
        router.push({ name: 'sign-up-prv' })
    } else if (localStorage.getItem(import.meta.env.VITE_PRV_SESSION_KEY) != null) {
        console.log('logged in provider');
        router.push({ name: 'dashboard' })
    } else {
        console.log('emit opendialog');
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
    router.push({ name: 'home' });
}
</script>