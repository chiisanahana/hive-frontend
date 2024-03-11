<template>
    <div class="row items-center justify-center fixed-full login-container">
        <a class="logo link fixed-top-left" href="/">
            <img />
            <p class="text-h6 text-bold text-accent">HIVE LOGO</p>
        </a>

        <LoginForm :user-type="UserType.C" @post-action="loginSuccess" @route-to-sign-up="signUp" />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from '@/components/forms/LoginForm.vue';
import { UserType } from '@/enums/enum';

const router = useRouter();

function loginSuccess() {
    router.push({ name: 'home' });
}

function signUp() {
    router.push({ name: 'sign-up' });
}

</script>

<style>
.login-container {
    background-image: url(/src/assets/images/splash-bg.svg);
    background-size: 600px;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
