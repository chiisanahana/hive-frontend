<template>
    <!-- <q-card class="q-py-md q-pl-md"> -->
    <q-card class="q-pa-md">
        <q-form @submit="submit">
            <div class="row q-gutter-x-sm q-gutter-y-md">
                <!-- <div class="col-xs-11 col-md-3 column drop-field"> -->
                <div class="col-auto column drop-field">
                    <label class="q-mb-xs row items-center">
                        <q-icon :name="ionLocation" size="xs" class="q-mr-xs" />
                        Destination
                    </label>
                    <q-select outlined dense v-model="selectedLocation" :options="locationsOpt!"
                        :error="errors.location" hide-bottom-space>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section>
                                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    No results
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </div>
                <!-- <div class="col-xs-7 col-sm-7 col-md-2 column date-field"> -->
                <div class="col-2 column date-field">
                    <label class="q-mb-xs row items-center">
                        <q-icon :name="ionCalendar" size="xs" class="q-mr-xs" />
                        Pick-up Date
                    </label>
                    <q-input outlined dense v-model="form.startDate" placeholder="Pick-up date"
                        :error="errors.startDate" hide-bottom-space :rules="['date']">
                        <q-popup-proxy ref="dateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.startDate" :options="validStartDate"
                                @update:model-value="dateProxy.hide()">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-input>
                </div>
                <!-- <div class="col-xs-4 col-sm-4 col-md-1 column time-field"> -->
                <div class="col-1 column time-field">
                    <label class="q-mb-xs row items-center">
                        <q-icon :name="ionTime" size="xs" class="q-mr-xs" />
                        Pick-up Time
                    </label>
                    <q-input outlined dense v-model="form.startTime" placeholder="Pick-up time"
                        :error="errors.startTime" hide-bottom-space :rules="[(val) => (val && val.length > 0)]">
                        <q-popup-proxy ref="timeProxy" cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.startTime">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                        </q-popup-proxy>
                    </q-input>
                </div>
                <div class="col-2 column date-field">
                    <label class="q-mb-xs row items-center">
                        <q-icon :name="ionCalendar" size="xs" class="q-mr-xs" />
                        Return Date
                    </label>
                    <q-input outlined dense v-model="form.endDate" placeholder="Return date" :error="errors.endDate"
                        hide-bottom-space :rules="['date']">
                        <q-popup-proxy ref="dateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.endDate" :options="validEndDate"
                                @update:model-value="dateProxy.hide()">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-input>
                </div>
                <div class="col-1 column time-field">
                    <label class="q-mb-xs row items-center">
                        <q-icon :name="ionTime" size="xs" class="q-mr-xs" />
                        Return Time
                    </label>
                    <q-input outlined dense v-model="form.endTime" placeholder="Return time" :error="errors.endTime"
                        hide-bottom-space :rules="[(val) => (val && val.length > 0)]">
                        <q-popup-proxy ref="timeProxy" cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.endTime">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-time>
                        </q-popup-proxy>
                    </q-input>
                </div>
                <div class="row q-my-md q-ml-md q-gutter-y-md">
                    <q-btn type="submit" unelevated round text-color="accent" :icon="ionSearch" />
                </div>
            </div>
        </q-form>
    </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import CryptoService from '@/services/crypto.service';
import UtilService from '@/services/util.service';
import type { RentDetails } from '@/interfaces/RentDetails';
import type { Option } from '@/interfaces/Option';
import { ionCalendar, ionLocation, ionSearch, ionTime } from '@quasar/extras/ionicons-v6';
const props = defineProps<{
    formValue?: RentDetails;
    routeTo?: string;
}>();

const emit = defineEmits<{
    search: []
}>();

const router = useRouter();
const dateProxy = ref();
const form: RentDetails = reactive({
    city: props.formValue?.city || '',
    province: props.formValue?.province || '',
    startDate: props.formValue?.startDate || getNowDate(),
    startTime: props.formValue?.startTime || getNowTime(),
    endDate: props.formValue?.endDate || getTomorrow(),
    endTime: props.formValue?.endTime || getNowTime(),
    pickupAddress: '',
    returnAddress: ''
});
const errors: any = reactive({
    location: false,
    startDate: false,
    startTime: false,
    endDate: false,
    endTime: false
});
const selectedLocation = ref<Option>(
    props.formValue?.city == undefined ? { label: '------', description: '' } :
        { label: props.formValue.city, description: props.formValue.province }
);
const locationsOpt = ref<Option[]>([]);
const isValidForm = ref<boolean>(true);

function getNowDate() {
    return date.formatDate(new Date(), 'YYYY/MM/DD');
}

function getTomorrow() {
    return date.formatDate(date.addToDate(new Date(), { days: 1 }), 'YYYY/MM/DD');
}

function getNowTime() {
    return date.formatDate(new Date(), 'HH:mm');
}

function getLocationOptions() {
    UtilService.getLocationList()
        .then((response) => {
            // console.log('location', response.data);
            response.data.map((data: string) => {
                const location = data.split(', ');
                locationsOpt.value.push({
                    label: location[0],
                    description: location[1]
                });
            })
            // console.log(locationsOpt.value);
            // locationsOpt.value = locationsOpt.value.concat(response.data);
        })
        .catch((error) => {
            console.error(error);
            return [];
        });
}

function getDateTime(date: string, time: string) {
    return date.concat(' ').concat(time);
}

function validStartDate(startDate: any) {
    return startDate >= getNowDate();
}

function validEndDate(endDate: any) {
    if (form.startDate != '') return endDate >= form.startDate;
    return endDate >= getNowDate();
}

function validateForm() {
    reset();
    if (selectedLocation.value.label === '------') {
        errors.location = true;
        isValidForm.value = false;
    }
    if (form.startDate > form.endDate) {
        errors.endDate = true;
        isValidForm.value = false;
    } else if (getDateTime(form.endDate, form.endTime) <= getDateTime(form.startDate, form.startTime)) {
        errors.endTime = true;
        isValidForm.value = false;
    }
}

function reset() {
    isValidForm.value = true;
    errors.location = errors.startDate = errors.startTime = errors.endDate = errors.endTime = false;
}

function submit() {
    validateForm();
    if (isValidForm.value) {
        form.city = selectedLocation.value.label;
        form.province = selectedLocation.value.description!;
        const encryptedData = CryptoService.encrypt(JSON.stringify(form));
        localStorage.setItem(import.meta.env.VITE_SESSION_DATA, encryptedData);
        if (props.routeTo === '') {
            emit('search');
        } else {
            router.push({ name: props.routeTo });
        }
    }
}

onMounted(() => {
    getLocationOptions();
});
</script>

<style scoped>
/* .drop-field {
    min-width: 150px;
}

.date-field {
    max-width: 140px;
} 

.time-field {
    max-width: 120px;
} */
.drop-field {
    min-width: 160px;
}

.date-field {
    min-width: 140px;
}

.time-field {
    min-width: 120px;
}
</style>