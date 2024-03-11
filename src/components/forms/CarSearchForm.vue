<template>
    <div class="row justify-center q-ma-md">
        <q-card class="search-card q-pa-md">
            <q-form @submit="$emit('onSubmit')">
                <q-card-section horizontal class="justify-between">
                    <q-card-section>
                        <q-input outlined dense v-model="form.location" label="Choose your Location">
                            <template v-slot:prepend>
                                <q-icon :name="ionLocation" />
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-separator vertical />
                    <q-card-section>
                        <div class="date-input">
                            <q-input outlined dense v-model="form.startDate" mask="date" label="Pick-up Date">
                                <template v-slot:prepend>
                                    <q-icon :name="ionCalendar" class="cursor-pointer">
                                        <q-popup-proxy ref="dateProxy" cover transition-show="scale"
                                            transition-hide="scale">
                                            <q-date v-model="form.startDate" @update:model-value="dateProxy.hide()">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                    </q-card-section>
                    <q-separator vertical />
                    <q-card-section>
                        <div class="date-input">
                            <q-input outlined dense v-model="form.endDate" mask="date" label="Return Date">
                                <template v-slot:prepend>
                                    <q-icon :name="ionCalendar" class="cursor-pointer">
                                        <q-popup-proxy ref="dateProxy" cover transition-show="scale"
                                            transition-hide="scale">
                                            <q-date v-model="form.endDate" @update:model-value="dateProxy.hide()">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <q-btn type="submit" unelevated color="primary" label="Search Car" />
                    </q-card-section>
                </q-card-section>
            </q-form>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { date } from 'quasar'
import { ionCalendar, ionLocation } from '@quasar/extras/ionicons-v6';

const dateProxy = ref();
const form: any = reactive({
    location: '',
    startDate: date.formatDate(new Date(), 'YYYY/MM/DD'),
    endDate: date.formatDate(date.addToDate(new Date(), { days: 1 }), 'YYYY/MM/DD')
});
const emit = defineEmits<{
    onSubmit: []
}>();

// function onSubmit() {
//     if (form.location.value !== '' && form.startDate.value !== '' && form.endDate.value !== '') {
//         console.log('form', form);
//     }
// }
</script>

<style>
.date-input {
    max-width: 300px;
}
</style>