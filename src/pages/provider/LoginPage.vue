<template>
    <div class="row q-pa-md items-center fixed-full">
        <!-- Logo -->
        <a class="logo link fixed-top-left" href="/">
            <img />
            <p class="text-h6 text-bold text-accent">HIVE LOGO</p>
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

const router = useRouter();

function loginSuccess() {
    router.push({ name: 'dashboard' });
}

</script>

<style>
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
    cursor: pointer;
}

.field-label {
    font-weight: 600;
}
</style>
