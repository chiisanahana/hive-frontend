<template>
    <div class="row q-pa-md items-center fixed-full">
        <!-- Logo -->
        <a class="q-ma-md link cursor-pointer fixed-top-left" @click="goToHome">
            <img :src="logo" height="44px" />
        </a>

        <!-- Form -->
        <div class="column col-6 items-center">
            <img :src="imgUrl" width="300px" />
        </div>
        <div class="column col-6 items-center">
            <q-form @submit="submit" class="form shadow-2">
                <p class="text-h5 text-bold text-center q-mt-sm">Daftar</p>

                <div class="column field q-gutter-y-sm">
                    <label class="field-label">Email</label>
                    <q-input outlined dense debounce="500" v-model="form.email" placeholder="Masukkan email"
                        autocomplete="on" lazy-rules :rules="[
            val => val && val.length > 0 || 'Email tidak dapat dikosongkan',
            val => isValidEmail(val.trim()) || 'Email tidak valid',
            val => isEmailAvail(val.trim())
        ]">
                        <template v-slot:prepend>
                            <q-icon :name="ionMail" />
                        </template>
                    </q-input>
                </div>

                <div class="column field q-gutter-y-sm">
                    <label class="field-label">Kata Sandi</label>
                    <q-input outlined dense :type="isPwd ? 'password' : 'text'" v-model="form.password"
                        placeholder="Masukkan kata sandi" autocomplete="on" lazy-rules :rules="[
            val => val && val.length > 0 || 'Kata sandi tidak dapat dikosongkan',
            val => val.length >= 8 || 'Kata sandi terlalu pendek'
        ]">
                        <template v-slot:prepend>
                            <q-icon :name="ionLockClosed" />
                        </template>
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd = !isPwd" />
                        </template>
                    </q-input>
                </div>

                <div class="column items-center q-mt-md q-gutter-y-lg">
                    <q-btn class="full-width q-pa-sm" label="Daftar" type="submit" color="primary" />
                    <p>Sudah memiliki akun? <a class="link cursor-pointer text-accent" @click="goToLogin">Masuk</a></p>
                </div>
            </q-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { UserAuth } from '@/interfaces/UserAuth';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import { UserType, Message } from '@/enums/enum';
import { ionLockClosed, ionMail } from '@quasar/extras/ionicons-v6';
import imgUrl from '@/assets/images/vector-register.svg';
import logo from '@/assets/images/logo.png';
import { useCustomerStore } from '@/stores/customer';

const router = useRouter();
const quasar = useQuasar();
const form: UserAuth = reactive({
    email: '',
    password: ''
});
const isPwd = ref<boolean>(true);
const customerStore = useCustomerStore();

function isValidEmail(email: string) {
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return regex.test(email);
};

function isEmailAvail(email: string) {
    return UserService.isEmailExists(email, UserType.C)
        .then((response: any) => {
            // console.log('is email available: ', !response.data);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(!response.data as boolean || Message.EMAIL_EXISTS);
                }, 500);
            })
        })
        .catch((error) => {
            console.error(error);
            return new Promise((resolve, reject) => {
                resolve(false || Message.INTERNAL_SERVER_ERROR);
            })
        });
}

function submit() {
    quasar.loading.show({ spinner: QSpinnerGears });
    // console.log('form', form);
    form.email = form.email.trim().toLowerCase();
    form.password = form.password.trim();

    UserService.register(form, UserType.C)
        .then((response) => {
            // console.log(response);
            storeUserInfo(response.data);
            quasar.loading.hide();
            router.push({ name: 'home' });
        })
        .catch((error) => {
            quasar.loading.hide();
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
        });
}

function storeUserInfo(data: any) {
    let customer = data;
    customer.is_provider = false;
    UserService.storeUser(customer, UserType.C);
    customerStore.setLoggedInUser(customer);
}

function goToLogin() {
    router.push({ name: 'login' });
}

function goToHome() {
    router.push({ name: 'home' });
}
</script>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 400px;
    border-radius: 20px;
}

.link {
    text-decoration: none;
    font-weight: 500;
}

.field-label {
    font-weight: 600;
}
</style>