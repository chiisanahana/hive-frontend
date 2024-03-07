<template>
    <div class="logo">
        <img />
        <p class="text-h6 text-bold text-accent">HIVE LOGO</p>
    </div>
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="row q-pa-md items-center fixed-full">
            <div class="column col-6 items-center">
                <img :src="imgUrl" width="300px" />
            </div>
            <div class="column col-6 items-center">
                <q-form @submit="submit" class="form shadow-2">
                    <p class="text-h5 text-bold text-center q-mt-sm">Sign Up</p>

                    <div class="column field q-gutter-y-sm">
                        <label class="field-label">Email</label>
                        <q-input outlined dense v-model="form.email" placeholder="Enter your email" lazy-rules :rules="[
                    val => val && val.length > 0 || 'Email is required',
                    val => isValidEmail(val) || 'Email is not valid'
                ]">
                            <template v-slot:prepend>
                                <q-icon name="email" />
                            </template>
                        </q-input>
                    </div>

                    <div class="column field q-gutter-y-sm">
                        <label class="field-label">Password</label>
                        <q-input outlined dense :type="isPwd ? 'password' : 'text'" v-model="form.password"
                            placeholder="Enter your password" lazy-rules :rules="[
                    val => val && val.length > 0 || 'Password is required',
                    val => val.length >= 8 || 'Password is too short'
                ]">
                            <template v-slot:prepend>
                                <q-icon name="lock" />
                            </template>
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>
                    </div>

                    <div class="column items-center q-mt-md q-gutter-y-lg">
                        <q-btn class="full-width q-pa-sm" label="Sign Up" type="submit" color="primary" />
                        <p>Already have an account? <a class="link text-accent" href="/login">Sign In</a></p>
                    </div>
                </q-form>
            </div>
        </div>
    </transition>
    <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
</template>

<script setup lang="ts">
import type { UserAuth } from '@/interfaces/UserAuth';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/user.service';
import { UserType } from '@/enums/enum';
import imgUrl from '@/assets/images/vector-register.svg'

const router = useRouter();
const form: UserAuth = reactive({
    email: '',
    password: ''
});
const isPwd = ref<boolean>(true);
const errorMsg = ref<string>('');
const visible = ref<boolean>(false);

function isValidEmail(email: string) {
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return regex.test(email.trim());
};

async function isEmailExists(email: string) {
    return UserService.isEmailExists(email, UserType.C)
        .then((response: any) => {
            console.log('is email exists: ', response.data);
            return response.data;
        });
}

async function submit() {
    visible.value = true;
    console.log('form', form);
    if (await isEmailExists(form.email)) {
        errorMsg.value = 'Email is already taken';
        // TODO: show error
    } else {
        console.log('register user');
        UserService.register(form, UserType.C)
            .then((response) => {
                console.log(response);
                // TODO: save registered (loged in) user data
                visible.value = false;
                router.push({ name: 'home' });
            })
            .catch((error) => {
                visible.value = false;
                console.error(error);
            });
    }
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