<template>
    <div class="q-pa-md" style="max-width: 400px">

        <q-form @submit="submit" class="q-gutter-md">
            <q-input filled v-model="form.email" label="Email" hint="Email" lazy-rules :rules="[
                val => val && val.length > 0 || 'Email is required',
                val => isValidEmail(val) || 'Email is not valid'
            ]" />

            <q-input filled type="text" v-model="form.password" label="Password" lazy-rules :rules="[
                val => val && val.length > 0 || 'Password is required'
            ]" />

            <div>
                <q-btn label="Login" type="submit" color="primary" />
            </div>
        </q-form>
    </div>
</template>

<script setup lang="ts">
import type { UserAuth } from "@/interfaces/UserAuth";
import { reactive } from "vue"

const form: UserAuth = reactive({
    email: '',
    password: ''
});

function isValidEmail(email: string) {
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    return regex.test(email);
};

// function validate() {
//     form.value.validate().then(success => {
//         if (success) {
//             // yay, models are correct
//         }
//         else {
//             // oh no, user has filled in
//             // at least one invalid value
//         }
//     })
// }

function submit() {
    // TODO: post user data here
    console.log('form', form);
}

// function reset() {
//     form.value.resetValidation()
// }
</script>