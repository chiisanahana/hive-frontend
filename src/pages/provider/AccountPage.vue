<template>
    <q-banner v-if="!isHasBankAccount(provider) && showBanner" dense class="bg-primary text-white">
        <template v-slot:avatar>
            <q-icon :name="ionWallet" color="white" />
        </template>
        Lengkapi data rekening bank Anda untuk dapat melakukan penarikan dana.
        <template v-slot:action>
            <q-btn flat color="white" label="Dismiss" @click="showBanner = false" />
        </template>
    </q-banner>
    <div class="row q-pa-md justify-center">
        <q-card flat class="col-xs-12">
            <q-card-section>
                <div class="row">
                    <div class="text-h6">Pengaturan Profil</div>
                    <q-space />
                    <q-btn v-if="!isEdit" flat color="accent" icon="edit" label="Ubah profil" no-caps
                        @click="isEdit = true" />
                </div>
            </q-card-section>

            <q-card-section class="row">
                <div class="col-3">
                    <!-- <q-card flat bordered class="q-pa-md" style="min-width: 300px">
                        Profile pict
                    </q-card> -->
                    <q-btn unelevated color="secondary" text-color="accent" class="full-width q-mt-md"
                        label="Ganti kata sandi" no-caps />
                </div>
                <div class="col-sm-1"></div>

                <div class="col">
                    <div class="q-mb-md">
                        <div class="text-bold q-mb-md">Informasi Profil</div>
                        <div class="q-gutter-y-sm">
                            <div class="row items-center">
                                <div class="col-xs-6 col-md-4 col-lg-3">Nama</div>
                                <div v-if="!isEdit" class="col">{{ provider?.name }}</div>
                                <q-input v-else class="col-7" style="min-width: 200px;" outlined dense
                                    v-model="form.name" autocomplete="on" lazy-rules :rules="[
                                        (val) => (val && val.length > 0) || 'Nama tidak dapat dikosongkan',
                                        (val) => isValidName(val.trim()) || 'Nama tidak valid']" hide-bottom-space />
                            </div>
                            <div class="row items-center">
                                <div class="col-xs-6 col-md-4 col-lg-3">Nama branding</div>
                                <div v-if="!isEdit" class="col"> {{ provider?.trading_name }} </div>
                                <q-input v-else class="col-7" style="min-width: 200px;" outlined dense debounce="500"
                                    v-model="form.trading_name" autocomplete="on" lazy-rules :rules="[
                                        (val) => (val && val.length > 0) || 'Nama branding tidak dapat dikosongkan']"
                                    hide-bottom-space />
                            </div>
                            <div class="row items-center">
                                <div class="col-xs-6 col-md-4 col-lg-3">Email</div>
                                <div v-if="!isEdit" class="col"> {{ provider?.email }} </div>
                                <q-input v-else class="col-7" style="min-width: 200px;" outlined dense debounce="500"
                                    v-model="form.email" autocomplete="on" lazy-rules :rules="[
                                        (val) => (val && val.length > 0) || 'Email tidak dapat dikosongkan',
                                        (val) => isValidEmail(val.trim()) || 'Email tidak valid',
                                        (val) => isEmailAvail(val.trim())]" hide-bottom-space />
                            </div>
                            <div class="row items-center">
                                <div class="col-xs-6 col-md-4 col-lg-3">Nomor telepon</div>
                                <div v-if="!isEdit" class="col">
                                    {{ provider?.phone_number }}
                                </div>
                                <q-input v-else class="col-7" style="min-width: 200px;" outlined dense
                                    v-model="form.phone_number" mask="##############" lazy-rules :rules="[
                                        (val) => (val && val.length > 0) || 'Nomor telepon tidak dapat dikosongkan',
                                        (val) => val.length >= 10 || 'Nomor telepon tidak valid']" />
                            </div>
                        </div>
                    </div>

                    <div class="q-mb-lg">
                        <div class="text-bold q-mb-md">Alamat</div>
                        <div class="q-gutter-y-sm">
                            <div class="row items-center">
                                <div v-if="!isEdit" class="col"> {{ provider?.address }} </div>
                                <q-input v-else class="col-10" style="min-width: 200px;" outlined dense debounce="500"
                                    v-model="form.address" autocomplete="on" lazy-rules :rules="[
                                        (val) => (val && val.length > 0) || 'Alamat tidak dapat dikosongkan']"
                                    hide-bottom-space />
                            </div>
                            <div class="row items-center">
                                <div v-if="!isEdit" class="col">{{ provider?.city }}, {{ provider?.province }}</div>
                                <div v-else class="col-10 row">
                                    <div class="col">
                                        <q-select dense outlined v-model="selectedCity" :options="cityList"
                                            @filter="getCityFilter" behavior="menu"
                                            :disable="selectedProvince.value == ''"
                                            :rules="[val => val && val.value != '' || 'Kota tidak dapat dikosongkan']"
                                            hide-bottom-space />
                                    </div>
                                    <div class="col q-ml-sm">
                                        <q-select dense outlined v-model="selectedProvince" :options="provinceList"
                                            @update:model-value="cityList = []" behavior="menu"
                                            :rules="[val => val && val.value != '' || 'Provinsi tidak dapat dikosongkan']"
                                            hide-bottom-space />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <BankAccountInfo v-if="!isEdit && provider != undefined" :provider="provider" />
                        <div v-else>
                            <div class="text-bold q-mb-md">Rekening Bank</div>
                            <div class="q-gutter-y-sm">
                                <div class="row items-center">
                                    <div class="col-3">Nama bank</div>
                                    <div class="col-7">
                                        <q-select dense outlined v-model="selectedBank" :options="bankList"
                                            behavior="menu" hide-bottom-space />
                                    </div>
                                </div>
                                <div class="row items-center">
                                    <div class="col-3">Nomor rekening</div>
                                    <q-input class="col-7" style="min-width: 200px;" outlined dense debounce="500"
                                        v-model="bankAccount" :disable="selectedBank.label == 'Pilih bank'"
                                        mask="#############" lazy-rules :rules="[
                                            (val) => (val && val.length >= 10) || 'Nomor rekening tidak valid',
                                            (val) => checkBankAccount(val)]" hide-bottom-space />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="isEdit" class="row q-gutter-md q-mt-sm justify-end">
                        <q-btn unelevated color="secondary" text-color="accent" label="Batal" @click="resetForm" />
                        <q-btn color="accent" label="Simpan" :disable="!isValidInput" @click="updateData" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import UtilService from '@/services/util.service';
import { isHasBankAccount, isValidEmail, isValidName } from '@/composables/validator';
import { Message, UserType } from '@/enums/enum';
import type { Provider } from '@/interfaces/rest/Provider';
import type { Option } from '@/interfaces/Option';
import { ionWallet } from '@quasar/extras/ionicons-v6';
import BankAccountInfo from '@/components/ui-block/BankAccountInfo.vue';
import { useProviderStore } from '@/stores/provider';

const quasar = useQuasar();
const provider = ref<Provider>();
const isEdit = ref<boolean>(false);
const showBanner = ref<boolean>(true);
const isValidInput = computed(() => isDataCompleted());

const form = reactive({
    name: '',
    trading_name: '',
    email: '',
    phone_number: '',
    province: '',
    city: '',
    address: '',
    bank_code: '',
    bank_account_number: '',
    bank_account_name: ''
});
const provinceList = ref<Option[]>([]);
const cityList = ref<Option[]>([]);
const bankList = ref<Option[]>([]);
const selectedProvince = ref<Option>({ label: 'Pilih provinsi', value: '' });
const selectedCity = ref<Option>({ label: 'Pilih kota', value: '' });
const selectedBank = ref<Option>({ label: 'Pilih bank', value: '' });
const bankAccount = ref<string>('');
const bankName = ref<string>('');
const providerStore = useProviderStore();

function getProvider() {
    quasar.loading.show({ spinner: QSpinnerGears });
    provider.value = UserService.getLoggedInPrv();
    if (isHasBankAccount(provider.value)) {
        setBankName(provider.value?.bank_code!, provider.value?.bank_account_number!);
    }
    getProvince();
    getBankList();
    resetForm();
    quasar.loading.hide();
}

function getProvince() {
    UtilService.getProvinceList().then((response) => {
        response.data.result.map((data: any) => {
            provinceList.value.push({
                value: data.id,
                label: data.text
            });
            if (data.text == provider.value?.province) {
                selectedProvince.value = { label: data.text, value: data.id };
            }
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

function getBankList() {
    UtilService.getBankList().then((response) => {
        response.data.data.map((data: any) => {
            bankList.value.push({
                value: data.kodeBank,
                label: data.namaBank
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

function updateData() {
    quasar.loading.show({ spinner: QSpinnerGears });

    form.province = selectedProvince.value?.label;
    form.city = selectedCity.value?.label.substring(selectedCity.value?.label.indexOf(' ') + 1);
    // console.log('form', form);
    UserService.updateProfile(provider.value?.id!, form, UserType.P)
        .then((response) => {
            console.log('updated', response.data);
            provider.value = response.data;
            UserService.storeUser(provider.value, UserType.P);
            providerStore.setLoggedInUser(provider.value!);
            quasar.loading.hide();
            resetForm();
            quasar.notify({
                color: 'positive',
                position: 'top-right',
                message: Message.PROFILE_UPDATE_SUCCESS
            });
        })
        .catch((error) => {
            quasar.loading.hide();
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
        })
}

function isEmailAvail(email: string) {
    if (provider.value != undefined && email == provider.value.email) return true;
    return UserService.isEmailExists(email, UserType.P)
        .then((response: any) => {
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

function checkBankAccount(bankNumber: string) {
    return UtilService.getBankAccount(selectedBank.value.value!, bankNumber)
        .then((response: any) => {
            // console.log(response)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (response.status) {
                        form.bank_code = response.data.data.bankcode;
                        form.bank_account_number = response.data.data.accountnumber;
                        form.bank_account_name = response.data.data.accountname;
                    }
                    resolve(response.data.status as boolean || Message.INVALID_BANK_ACCOUNT);
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

function setBankName(bankCode: string, accountNumber: string) {
    UtilService.getBankAccount(bankCode, accountNumber).then((response) => {
        bankName.value = response.data.bankname;
    })
}

function isDataCompleted() {
    const isMainDataCompleted = form.name !== '' && form.trading_name !== '' &&
        form.email !== '' && form.phone_number !== '' &&
        form.address !== '' && form.city !== '' &&
        form.province !== '';

    if (selectedBank.value.label != 'Pilih bank' && form.bank_account_number == '') return false;
    if (isMainDataCompleted && selectedBank.value.label == 'Pilih bank') return true;
    return isMainDataCompleted && form.bank_account_number != '';
}

function resetForm() {
    isEdit.value = false;
    if (provider.value != undefined) {
        form.name = provider.value?.name ? provider.value?.name : '';
        form.trading_name = provider.value?.trading_name ? provider.value?.trading_name : '';
        form.email = provider.value?.email;
        form.phone_number = provider.value.phone_number ? provider.value.phone_number : '';
        form.province = provider.value.province ? provider.value.province : '';
        form.city = provider.value.city ? provider.value.city : '';
        form.address = provider.value.address ? provider.value.address : '';
        form.bank_code = isHasBankAccount(provider.value) ? provider.value.bank_code! : '';
        form.bank_account_number = isHasBankAccount(provider.value) ? provider.value.bank_account_number! : '';
        form.bank_account_name = isHasBankAccount(provider.value) ? provider.value.bank_account_name! : '';
        selectedCity.value = { label: form.city };
        selectedBank.value = { label: 'Pilih bank' };
    }
}

onMounted(() => {
    getProvider();
});
</script>