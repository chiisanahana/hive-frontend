<template>
    <div class="row q-pa-md items-center justify-end fixed-full">
        <!-- Logo -->
        <a class="q-ma-md link cursor-pointer fixed-top-left" href="/">
            <img :src="logo" height="44px" />
        </a>

        <!-- Form -->
        <div class="col-4 fixed-bottom">
            <img :src="imgUrl" width="350px" />
        </div>
        <div class="col-7 q-mr-xl">
            <ProviderRegistrationForm />
        </div>
    </div>
</template>

<script setup lang="ts">
import imgUrl from '@/assets/images/vector-register-prv.svg';
import ProviderRegistrationForm from '@/components/forms/ProviderRegistrationForm.vue';
import logo from '@/assets/images/logo.png';
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