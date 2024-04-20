<template>
    <div class="q-pa-md">
        <q-form @submit="submit">
            <q-stepper v-model="step" vertical color="primary" animated>
                <p class="text-h5 text-bold text-center q-mt-sm">
                    Daftar
                    <q-badge align="top">Penyedia</q-badge>
                </p>

                <q-step :name="1" title="Lengkapi informasi pengguna" :icon="ionPerson" :active-icon="ionPerson"
                    :done="step > 1">
                    <div class="q-mb-md">Masukkan nama lengkap dan kredensial akun Anda sebagai penyedia mobil.</div>

                    <div class="row">
                        <div class="column col-6 q-gutter-y-sm">
                            <div class="column">
                                <label class="field-label q-mb-xs">Nama Lengkap</label>
                                <q-input outlined dense debunce="500" v-model="form.name"
                                    @update:model-value="() => { form.name = formatNameCase(form.name) }"
                                    placeholder="Masukkan nama lengkap" autocomplete="on" hide-bottom-space lazy-rules
                                    :rules="[
                                        val => val && val.length > 0 || 'Nama tidak dapat dikosongkan',
                                        val => isValidName(val.trim()) || 'Nama tidak valid']">
                                </q-input>
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Email</label>
                                <q-input outlined dense debunce="500" v-model="form.email" placeholder="Masukkan email"
                                    autocomplete="on" hide-bottom-space lazy-rules :rules="[
                                        val => val && val.length > 0 || 'Email tidak dapat dikosongkan',
                                        val => isValidEmail(val.trim()) || 'Email tidak valid',
                                        val => isEmailAvail(val.trim())
                                    ]">
                                </q-input>
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Kata sandi</label>
                                <q-input outlined dense :type="isPwd ? 'password' : 'text'" v-model="form.password"
                                    placeholder="Masukkan kata sandi" autocomplete="on" hide-bottom-space lazy-rules
                                    :rules="[
                                        val => val && val.length > 0 || 'Kata sandi tidak dapat dikosongkan',
                                        val => val.length >= 8 || 'Kata sandi terlalu pendek'
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
                        <q-btn @click="step = 2" color="primary" label="Lanjutkan" :disable="!validStepOne()" />
                    </q-stepper-navigation>
                </q-step>

                <q-step :name="2" title="Ciptakan branding" :icon="ionStorefront" :active-icon="ionStorefront"
                    :done="step > 2">
                    <div class="q-mb-md">Masukkan nama branding dan informasi kontak yang akan ditampilkan.</div>

                    <div class="row">
                        <div class="column col-6 q-gutter-y-sm">
                            <div class="column">
                                <label class="field-label q-mb-xs">Nama Branding</label>
                                <q-input outlined dense v-model="form.trading_name"
                                    @update:model-value="() => { form.trading_name = formatNameCase(form.trading_name) }"
                                    placeholder="Masukkan nama branding" autocomplete="on" hide-bottom-space
                                    lazy-rules
                                    :rules="[val => val && val.length > 0 || 'Nama branding tidak dapat dikosongkan']">
                                </q-input>
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Nomor Telepon</label>
                                <q-input outlined dense v-model="form.phone_number" mask="##############"
                                    placeholder="Masukkan nomor telepon" lazy-rules :rules="[
                                        (val) => (val && val.length > 0) || 'Nomor telepon tidak dapat dikosongkan',
                                        (val) => val.length >= 10 || 'Nomor telepon tidak valid']" />
                            </div>
                        </div>
                    </div>

                    <q-stepper-navigation>
                        <q-btn @click="step = 3" color="primary" label="Lanjutkan" :disable="!validStepTwo()" />
                        <q-btn flat @click="step = 1" color="primary" label="Kembali" class="q-ml-sm" />
                    </q-stepper-navigation>
                </q-step>

                <q-step :name="3" title="Lengkapi lokasi rental" :icon="ionLocation" :active-icon="ionLocation">
                    <div class="q-mb-md">Informasikan alamat jelas rental Anda berada.</div>

                    <div class="row">
                        <div class="column col-6 q-gutter-y-sm">
                            <div class="column">
                                <label class="field-label q-mb-xs">Provinsi</label>
                                <q-select dense outlined v-model="selectedProvince" :options="provinceList"
                                    @update:model-value="cityList = []" behavior="menu"
                                    :rules="[val => val && val.value != '' || 'Provinsi tidak dapat dikosongkan']"
                                    hide-bottom-space />
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Kota</label>
                                <q-select dense outlined v-model="selectedCity" :options="cityList"
                                    @filter="getCityFilter" behavior="menu" :disable="selectedProvince.value == ''"
                                    :rules="[val => val && val.value != '' || 'Kota tidak dapat dikosongkan']"
                                    hide-bottom-space />
                            </div>
                            <div class="column">
                                <label class="field-label q-mb-xs">Alamat</label>
                                <q-input outlined dense v-model="form.address" placeholder="Masukkan address"
                                    hide-bottom-space lazy-rules :rules="[
                                        (val) => (val && val.length > 0) || 'Alamat tidak dapat dikosongkan']" />
                            </div>
                        </div>
                    </div>

                    <q-stepper-navigation>
                        <q-btn color="primary" type="submit" label="Daftar" :disable="!validStepThree()" />
                        <q-btn flat @click="step = 2" color="primary" label="Kembali" class="q-ml-sm" />
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
import UtilService from '@/services/util.service';
import { UserType, Message } from '@/enums/enum';
import { ionLocation, ionPerson, ionStorefront } from '@quasar/extras/ionicons-v6';
import { isValidEmail, isValidName } from '@/composables/validator';
import { formatNameCase } from '@/composables/formatter';
import type { Option } from '@/interfaces/Option';
import { useProviderStore } from '@/stores/provider';

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
const provinceList = ref<Option[]>([]);
const cityList = ref<Option[]>([]);
const selectedProvince = ref<Option>({ label: 'Pilih provinsi', value: '' });
const selectedCity = ref<Option>({ label: 'Pilih kota', value: '' });
const providerStore = useProviderStore();

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

function getProvince() {
    UtilService.getProvinceList().then((response) => {
        response.data.result.map((data: any) => {
            provinceList.value.push({
                value: data.id,
                label: data.text
            });
        });
    }).catch((error) => {
        quasar.notify({
            color: 'negative',
            position: 'top-right',
            message: Message.INTERNAL_SERVER_ERROR
        });
    });
}

function getCityFilter(val: any, update: any) {
    if (cityList.value.length > 0) {
        update();
        return;
    }

    UtilService.getCityList(parseInt(selectedProvince.value.value!))
        .then((response) => {
            update(() => {
                response.data.result.map((data: any) => {
                    cityList.value.push({
                        value: data.id,
                        label: data.text
                    });
                });
            });
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
    const address = form.address.trim();
    return selectedProvince.value.value != '' && selectedCity.value.value != '' && address != '';
}

function submit() {
    quasar.loading.show({ spinner: QSpinnerGears });
    // make sure there is no leading or trailing space
    form.name = form.name.trim();
    form.email = form.email.trim();
    form.password = form.password.trim();
    form.trading_name = form.trading_name.trim();
    form.province = selectedProvince.value?.label;
    form.city = selectedCity.value?.label.substring(selectedCity.value?.label.indexOf(' ') + 1);
    form.address = form.address.trim();

    // console.log('submit', form);
    UserService.register(form, UserType.P)
        .then((response) => {
            // console.log(response.data);
            UserService.storeUser(response.data, UserType.P);
            providerStore.setLoggedInUser(response.data);

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
    getProvince();
});
</script>

<style scoped>
.field-label {
    font-weight: 500;
}
</style>