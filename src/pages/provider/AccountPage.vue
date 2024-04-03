<template>
    <div class="row q-pa-md q-gutter-md justify-center">
        <q-card flat :class="isEdit ? 'col-10' : 'col-10 q-pb-lg'">
            <q-card-section>
                <div class="row">
                    <div class="text-h6">Account Setting</div>
                    <q-space />
                    <q-btn v-if="!isEdit" flat color="accent" icon="edit" label="Edit account" no-caps
                        @click="isEdit = true" />
                </div>
            </q-card-section>
            <q-card-section v-if="!isDataCompleted()">
                Complete your account info
            </q-card-section>

            <q-card-section horizontal>
                <q-card-section class="col-auto" style="min-width: 300px">
                    <!-- <q-card flat bordered class="q-pa-md" style="min-width: 300px">
                        Profile pict
                    </q-card> -->
                    <q-btn unelevated color="secondary" text-color="accent" class="full-width q-mt-md"
                        label="Change your password" no-caps />
                </q-card-section>
                <q-card-section class="col q-ml-lg" :class="isEdit ? 'q-gutter-y-xs' : 'q-gutter-y-lg'">
                    <div class="row items-center">
                        <div :class="isEdit ? 'col-4 field-title' : 'col-3'">Name</div>
                        <div v-if="!isEdit" class="col">{{ customer?.name }}</div>
                        <q-input v-else class="col-7" style="min-width: 200px;" outlined dense v-model="form.name"
                            autocomplete="on" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Name is required',
            (val) => isValidName(val.trim()) || 'Name is not valid']" />
                    </div>
                    <div class="row items-center">
                        <div :class="isEdit ? 'col-4 field-title' : 'col-3'">Email</div>
                        <div v-if="!isEdit" class="col"> {{ customer?.email }} </div>
                        <q-input v-else class="col-7" style="min-width: 200px;" outlined dense debounce="500"
                            v-model="form.email" autocomplete="on" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Email is required',
            (val) => isValidEmail(val.trim()) || 'Email is not valid',
            (val) => isEmailAvail(val.trim())]" />
                    </div>
                    <div class="row items-center">
                        <div :class="isEdit ? 'col-4 field-title' : 'col-3'">Phone number</div>
                        <div v-if="!isEdit" class="col">
                            {{ isHasPhoneNumber() ? customer?.phone_number : '-' }}
                        </div>
                        <q-input v-else class="col-7" style="min-width: 200px;" outlined dense
                            v-model="form.phone_number" mask="##############" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Phone number is required',
            (val) => val.length >= 10 || 'Phone number is not valid']" />
                    </div>
                    <div v-if="isEdit" class="row q-gutter-md q-mt-sm justify-end">
                        <q-btn unelevated color="secondary" text-color="accent" label="Cancel" @click="resetForm" />
                        <q-btn color="accent" label="Save Profile" :disable="!isValidInput" @click="updateData" />
                    </div>
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import { isValidEmail, isValidName } from '@/composables/validator';
import type { Customer } from '@/interfaces/rest/Customer';
import { Message, UserType } from '@/enums/enum';

const quasar = useQuasar();
const customer = ref<Customer>();
const isEdit = ref<boolean>(false);
const isValidInput = computed(() => form.name !== '' && form.email !== '' && form.phone_number !== '');

const form = reactive({
    name: '',
    email: '',
    phone_number: ''
});

function getCustomer() {
    quasar.loading.show({ spinner: QSpinnerGears });
    customer.value = UserService.getLoggedInPrv();
    resetForm();
    quasar.loading.hide();
}

function updateData() {
    quasar.loading.show({ spinner: QSpinnerGears });

    UserService.updateProfile(customer.value?.id!, form, UserType.P)
        .then((response) => {
            // console.log('updated', response.data);
            customer.value = response.data;
            UserService.storeUser(customer.value, UserType.P);
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
    if (customer.value != undefined && email == customer.value.email) return true;
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

<style scoped>
.field-title {
    line-height: 40px;
    padding-bottom: 20px;
}
</style>