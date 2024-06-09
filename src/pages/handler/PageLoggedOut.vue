<template>
    <div id="logout" class="row items-center justify-end fixed-full">
        <div class="col-4 fixed-bottom">
            <img :src="imgUrl" width="100%">
        </div>
        <div class="col-8 logout">
            <h2>Anda telah keluar</h2>
            <p>Terima kasih telah menggunakan HiVe!</p>
            <div class="q-gutter-md q-mt-lg">
                <a class="secondary cursor-pointer" @click="goToLogin">Masuk dengan akun lain</a>
                <a class="primary cursor-pointer" @click="goToHome">Kembali ke halaman utama</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import imgUrl from '@/assets/images/vector-logout.svg';
import { useRouter } from 'vue-router';
const router = useRouter();

function goToLogin() {
    router.push({ name: 'login' });
}

function goToHome() {
    router.push({ name: 'home' });
}
</script>

<style scoped>
* {
    font-family: 'Maven Pro', sans-serif;
}

body {
    background-color: #FFFFFF !important;
}

.logout {
    max-width: 920px;
    line-height: 1.4;
    text-align: center;
}

.logout h2 {
    font-size: 46px;
    color: #000;
    font-weight: 900;
    text-transform: uppercase;
    margin: 0px;
}

.logout p {
    font-size: 16px;
    color: #000;
    font-weight: 400;
    text-transform: uppercase;
    margin-top: 15px;
}

.logout a {
    font-size: 14px;
    text-decoration: none;
    text-transform: uppercase;
    display: inline-block;
    padding: 16px 38px;
    border-radius: 40px;
    font-weight: 400;
    -webkit-transition: 0.2s all;
    transition: 0.2s all;
}

.logout .primary {
    background: #608CF8;
    border: 2px solid transparent;
    color: #FFFFFF;
}

.logout .primary:hover {
    background-color: #ECF1FF;
    border-color: #86A7FC;
    color: #86A7FC;
}

.logout .secondary {
    background-color: #FFFFFF;
    border: 2px solid #86A7FC;
    color: #86A7FC;
}

.logout .secondary:hover {
    background: #ECF1FF;
    border-color: transparent;
    color: #608CF8;
}

@media only screen and (max-width: 480px) {
    .logout h2 {
        font-size: 26px;
    }
}
</style>