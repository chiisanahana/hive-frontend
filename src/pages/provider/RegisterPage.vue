<template>
    <div class="row q-pa-md items-center justify-end fixed-full">
        <!-- Logo -->
        <a class="logo link cursor-pointer fixed-top-left" href="/">
            <img />
            <p class="text-h6 text-bold text-accent">HIVE LOGO</p>
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