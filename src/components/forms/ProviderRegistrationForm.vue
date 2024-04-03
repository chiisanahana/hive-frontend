<template>
    <div class="q-pa-md">
        <q-form @submit="submit">
            <q-stepper v-model="step" vertical color="primary" animated>
                <p class="text-h5 text-bold text-center q-mt-sm">
                    Sign Up
                    <q-badge align="top">as Provider</q-badge>
                </p>

                <q-step :name="1" title="Provide your user information" :icon="ionPerson" :active-icon="ionPerson"
                    :done="step > 1">
                    <div class="q-mb-md">Input your full name and credentials for your account as car provider.</div>

                    <div class="row">
                        <div class="column col-6 q-gutter-y-sm">
                            <div class="column">
                                <label class="field-label q-mb-xs">Full Name</label>
                                <q-input outlined dense debunce="500" v-model="form.name"
                                    @update:model-value="() => { form.name = formatNameCase(form.name) }"
                                    placeholder="Enter your full name" autocomplete="on" hide-bottom-space lazy-rules
                                    :rules="[
            val => val && val.length > 0 || 'Name is required',
            val => isValidName(val.trim()) || 'Name is not valid']">
                                </q-input>
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Email</label>
                                <q-input outlined dense debunce="500" v-model="form.email"
                                    placeholder="Enter your email" autocomplete="on" hide-bottom-space lazy-rules
                                    :rules="[
            val => val && val.length > 0 || 'Email is required',
            val => isValidEmail(val.trim()) || 'Email is not valid',
            val => isEmailAvail(val.trim())
        ]">
                                </q-input>
                            </div>

                            <div class="column">
                                <label class="field-label q-mb-xs">Password</label>
                                <q-input outlined dense :type="isPwd ? 'password' : 'text'" v-model="form.password"
                                    placeholder="Enter your password" autocomplete="on" hide-bottom-space lazy-rules
                                    :rules="[
            val => val && val.length > 0 || 'Password is required',
            val => val.length >= 8 || 'Password is too short'
        ]">
                                    <template v-slot:append>
                                        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                            @click="isPwd = !isPwd" />
                                    </template>
                                </q-input>
                            </div>
                        </div>
                    </div>

                    <q-stepper-navigation>
                        <q-btn @click="step = 2" color="primary" label="Continue" :disable="!validStepOne()" />
                    </q-stepper-navigation>
                </q-step>

                <q-step :name="2" title="Create your branding" :icon="ionStorefront" :active-icon="ionStorefront"
                    :done="step > 2">
                    <div class="q-mb-md">Input your branding name and contact information that will be shown to the
                        customers.</div>

                    <div class="row">
                        <div class="column col-6 q-gutter-y-sm">
                            <div class="column">
                                <label class="field-label q-mb-xs">Branding Name</label>
                                <q-input outlined dense v-model="form.trading_name"
                                    @update:model-value="() => { form.trading_name = formatNameCase(form.trading_name) }"
                                    placeholder="Enter your branding name" autocomplete="on" hide-bottom-space
                                    lazy-rules :rules="[val => val && val.length > 0 || 'Branding name is required']">
                                </q-input>
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Phone Number</label>
                                <q-input outlined dense v-model="form.phone_number" mask="##############"
                                    placeholder="Enter your phone number" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Phone number is required',
            (val) => val.length >= 10 || 'Phone number is not valid']" />
                            </div>
                        </div>
                    </div>

                    <q-stepper-navigation>
                        <q-btn @click="step = 3" color="primary" label="Continue" :disable="!validStepTwo()" />
                        <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
                    </q-stepper-navigation>
                </q-step>

                <q-step :name="3" title="Set your rental location" :icon="ionLocation" :active-icon="ionLocation">
                    <div class="q-mb-md">Input your branding name and contact information that will be shown to the
                        customers.</div>

                    <div class="row">
                        <div class="column col-6 q-gutter-y-sm">
                            <div class="column">
                                <label class="field-label q-mb-xs">Province</label>
                                <q-input outlined dense v-model="form.province"
                                    placeholder="Enter your province location" hide-bottom-space lazy-rules
                                    :rules="[val => val && val.length > 0 || 'Province is required']">
                                </q-input>
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">City</label>
                                <q-input outlined dense v-model="form.city" placeholder="Enter your city location"
                                    hide-bottom-space lazy-rules
                                    :rules="[(val) => (val && val.length > 0) || 'City is required']" />
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Address</label>
                                <q-input outlined dense v-model="form.address" placeholder="Enter your address"
                                    hide-bottom-space lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Address is required']" />
                            </div>
                        </div>
                    </div>

                    <q-stepper-navigation>
                        <q-btn color="primary" type="submit" label="Sign Up" :disable="!validStepThree()" />
                        <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
                    </q-stepper-navigation>
                </q-step>
            </q-stepper>
        </q-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import { UserType, Message } from '@/enums/enum';
import { ionLocation, ionPerson, ionStorefront } from '@quasar/extras/ionicons-v6';
import { isValidEmail, isValidName } from '@/composables/validator';
import { formatNameCase } from '@/composables/formatter';

const router = useRouter();
const quasar = useQuasar();
const step = ref<number>(1);
const form: any = reactive({
    name: '',
    email: '',
    password: '',
    trading_name: '',
    phone_number: '',
    province: '',
    city: '',
    address: ''
});
const isPwd = ref<boolean>(true);
const isEmailExists = ref<boolean>(false);

function isEmailAvail(email: string) {
    return UserService.isEmailExists(email, UserType.P)
        .then((response: any) => {
            isEmailExists.value = response.data;
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

function validStepOne() {
    const email = form.email.trim();
    const password = form.password.trim();
    const name = form.name.trim();
    return name != '' && email != '' && password != ''
        && isValidName(name) && isValidEmail(email) && password.length >= 8 && !isEmailExists.value;
}

function validStepTwo() {
    const tradingName = form.trading_name.trim();
    return tradingName != '' && form.phone_number != '' && form.phone_number.length >= 10;
}

function validStepThree() {
    const province = form.province.trim();
    const city = form.city.trim();
    const address = form.address.trim();
    return province != '' && city != '' && address != '';
}

function submit() {
    quasar.loading.show({ spinner: QSpinnerGears });
    // make sure there is no leading or trailing space
    form.name = form.name.trim();
    form.email = form.email.trim();
    form.password = form.password.trim();
    form.trading_name = form.trading_name.trim();
    form.province = form.province.trim();
    form.city = form.city.trim();
    form.address = form.address.trim();

    // console.log('submit', form);
    UserService.register(form, UserType.P)
        .then((response) => {
            // console.log(response.data);
            UserService.storeUser(response.data, UserType.P);

            // set cust info if same as provider
            let customer = UserService.getLoggedInCust();
            if (customer.email == response.data.email) {
                customer.is_provider = true;
                UserService.storeUser(customer, UserType.C);
            }

            quasar.loading.hide();
            router.push({ name: 'dashboard' });
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

onMounted(() => {
    form.email = UserService.getLoggedInCust().email;
});
</script>

<style scoped>
.field-label {
    font-weight: 500;
}
</style>