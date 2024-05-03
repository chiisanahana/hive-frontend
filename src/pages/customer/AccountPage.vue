<template>
    <q-banner v-if="!isDataCompleted() && showBanner && !isEdit" dense class="bg-primary text-white">
        <template v-slot:avatar>
            <q-icon :name="ionInformationCircle" color="white" />
        </template>
        Lengkapi informasi profilmu!
        <template v-slot:action>
            <q-btn flat color="white" label="Tutup" @click="showBanner = false" />
            <q-btn flat color="white" label="Perbarui Data" @click="isEdit = true; showBanner = false" />
        </template>
    </q-banner>

    <div class="row q-pa-md justify-center">
        <q-card flat :class="isEdit ? 'col-xs-12 col-sm-9' : 'col-xs-12 col-sm-9 q-pb-md'">
            <q-card-section>
                <div class="row">
                    <div class="text-h6">Pengaturan Profil</div>
                    <q-space />
                    <q-btn v-if="!isEdit" flat color="accent" icon="edit" label="Ubah profil" no-caps
                        @click="isEdit = true" />
                </div>
            </q-card-section>

            <q-card-section horizontal>
                <q-card-section class="col-auto" style="min-width: 300px">
                    <q-card flat bordered class="q-pa-sm row justify-center" style="min-width: 300px">
                        <q-avatar v-if="customer?.profile_picture != null" rounded size="16vw">
                            <img :src="getProfPict(customer)">
                        </q-avatar>
                        <q-avatar v-else rounded size="16vw" color="orange" class="text-white">
                            {{ customer?.name?.charAt(0).toUpperCase() }}
                        </q-avatar>
                    </q-card>
                    <q-btn unelevated color="secondary" text-color="accent" class="full-width q-mt-md"
                        label="Ganti foto profil" :icon="ionCamera" no-caps @click="profileDialog = true" />
                    <!-- <q-btn unelevated outline color="accent" class="full-width q-mt-md" label="Ganti kata sandi"
                        no-caps /> -->
                </q-card-section>
                <q-card-section class="col q-ml-lg">
                    <div :class="isEdit ? 'q-gutter-y-sm' : 'q-gutter-y-md'">
                        <div class="row items-center">
                            <div class="col-xs-6 col-md-4 col-lg-3">Nama</div>
                            <div v-if="!isEdit" class="col">{{ customer?.name }}</div>
                            <q-input v-else class="col-7" style="min-width: 200px;" outlined dense v-model="form.name"
                                autocomplete="on" lazy-rules :rules="[
                                    (val) => (val && val.length > 0) || 'Nama tidak dapat dikosongkan',
                                    (val) => isValidName(val.trim()) || 'Nama tidak valid']" hide-bottom-space />
                        </div>
                        <div class="row items-center">
                            <div class="col-xs-6 col-md-4 col-lg-3">Email</div>
                            <div v-if="!isEdit" class="col"> {{ customer?.email }} </div>
                            <q-input v-else class="col-7" style="min-width: 200px;" outlined dense debounce="500"
                                v-model="form.email" autocomplete="on" lazy-rules :rules="[
                                    (val) => (val && val.length > 0) || 'Email tidak dapat dikosongkan',
                                    (val) => isValidEmail(val.trim()) || 'Email tidak valid',
                                    (val) => isEmailAvail(val.trim())]" hide-bottom-space />
                        </div>
                        <div class="row items-center">
                            <div class="col-xs-6 col-md-4 col-lg-3">Nomor telepon</div>
                            <div v-if="!isEdit" class="col">
                                {{ isHasPhoneNumber() ? customer?.phone_number : '-' }}
                            </div>
                            <q-input v-else class="col-7" style="min-width: 200px;" outlined dense
                                v-model="form.phone_number" mask="##############" lazy-rules :rules="[
                                    (val) => (val && val.length > 0) || 'Phone number tidak dapat dikosongkan',
                                    (val) => val.length >= 10 || 'Phone number tidak valid']" hide-bottom-space />
                        </div>
                    </div>
                    <div v-if="isEdit" class="row q-gutter-md q-mt-sm justify-end">
                        <q-btn unelevated color="secondary" text-color="accent" label="Batal" @click="resetForm" />
                        <q-btn color="accent" label="Simpan" :disable="!isValidInput" @click="updateData" />
                    </div>
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
    <ProfileDoalog v-model="profileDialog" @close="updateProfile" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import { isValidEmail, isValidName } from '@/composables/validator';
import type { Customer } from '@/interfaces/rest/Customer';
import { Message, UserType } from '@/enums/enum';
import { useCustomerStore } from '@/stores/customer';
import { ionCamera, ionInformationCircle } from '@quasar/extras/ionicons-v6';
import { getProfPict } from '@/composables/getter';
import ProfileDoalog from '@/components/dialog/ProfileDialog.vue';

const quasar = useQuasar();
const customer = ref<Customer>();
const isEdit = ref<boolean>(false);
const isValidInput = computed(() => form.name !== '' && form.email !== '' && form.phone_number !== '');
const customerStore = useCustomerStore();
const showBanner = ref<boolean>(true);
const profileDialog = ref<boolean>(false);

const form = reactive({
    name: '',
    email: '',
    phone_number: ''
});

function getCustomer() {
    quasar.loading.show({ spinner: QSpinnerGears });
    // customer.value = UserService.getLoggedInCust();
    customer.value = customerStore.getLoggedInUser;
    resetForm();
    quasar.loading.hide();
}

//  TODO: cuma buat customer
function updateData() {
    quasar.loading.show({ spinner: QSpinnerGears });

    const isProvider = customer.value?.is_provider;
    UserService.updateProfile(customer.value?.id!, form, UserType.C)
        .then((response) => {
            // console.log('updated', response.data);
            customer.value = response.data;
            customer.value!.is_provider = isProvider;
            UserService.storeUser(customer.value, UserType.C);
            customerStore.setLoggedInUser(customer.value!);
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

// TODO: blm kelar
function updateProfile(fileId: string) {
    quasar.loading.show({ spinner: QSpinnerGears });

    const isProvider = customer.value?.is_provider;
    UserService.updateProfilePict(customer.value?.id!, fileId, UserType.C)
        .then((response) => {
            // console.log('updated', response.data);
            customer.value = response.data;
            customer.value!.is_provider = isProvider;
            UserService.storeUser(customer.value, UserType.C);
            customerStore.setLoggedInUser(customer.value!);
            quasar.loading.hide();
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
    if (customer.value != undefined && email == customer.value.email) return true;
    return UserService.isEmailExists(email, UserType.C)
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

function isHasPhoneNumber() {
    if (customer.value != undefined &&
        customer.value.phone_number != null &&
        customer.value.phone_number != '') return true;
    return false;
}

function isDataCompleted() {
    // email is already filled, name can be still autogenerated
    if (customer.value != undefined &&
        customer.value.name != customer.value.name?.toLowerCase() &&
        isHasPhoneNumber()) return true;
    return false;
}

function resetForm() {
    isEdit.value = false;
    if (customer.value != undefined) {
        form.name = customer.value.name != customer.value.name?.toLowerCase() ? customer.value?.name! : '';
        form.email = customer.value?.email;
        form.phone_number = isHasPhoneNumber() ? customer.value?.phone_number! : '';
    }
}

onMounted(() => {
    getCustomer();
});
</script>
