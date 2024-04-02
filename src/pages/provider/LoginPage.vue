<template>
    <div class="row q-pa-md items-center fixed-full">
        <!-- Logo -->
        <a class="q-ma-md link cursor-pointer fixed-top-left" @click="goToHome">
            <img :src="logo" height="44px" />
        </a>
        <div class="column col-6 items-center">
            <img :src="imgUrl" width="300px" />
        </div>
        <div class="column col-6 items-center">
            <LoginForm :user-type="UserType.P" @post-action="loginSuccess" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from '@/components/forms/LoginForm.vue';
import { UserType } from '@/enums/enum';
import imgUrl from '@/assets/images/vector-register-prv.svg';
import logo from '@/assets/images/logo.png';

const router = useRouter();

function loginSuccess() {
    router.push({ name: 'dashboard' });
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
