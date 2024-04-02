<template>
    <div class="row items-center justify-center fixed-full login-container">
        <a class="q-ma-md link cursor-pointer fixed-top-left" @click="goToHome">
            <img :src="logo" height="44px" />
        </a>

        <LoginForm :user-type="UserType.C" @post-action="loginSuccess" @route-to-sign-up="signUp" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from '@/components/forms/LoginForm.vue';
import { UserType } from '@/enums/enum';
import logo from '@/assets/images/logo.png';

const router = useRouter();

function loginSuccess() {
    router.push({ name: 'home' });
}

function signUp() {
    router.push({ name: 'sign-up' });
}

function goToHome() {
    router.push({ name: 'home' });
}

</script>

<style scoped>
.login-container {
    background-image: url(/src/assets/images/splash-bg.svg);
    background-size: 600px;
    background-repeat: no-repeat;
    background-position: center;
}

.link {
    text-decoration: none;
    font-weight: 500;
}
</style>
