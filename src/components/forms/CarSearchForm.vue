<template>
    <div class="row justify-center q-ma-md">
        <q-card class="search-card col-10 q-pa-md">
            <q-form @submit="onSubmit">
                <q-card-section horizontal class="justify-between">
                    <q-card-section>
                        <q-input outlined dense v-model="form.location" label="Choose your Location">
                            <template v-slot:prepend>
                                <q-icon name="place" />
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-separator vertical />
                    <q-card-section>
                        <div class="date-input">
                            <q-input outlined dense v-model="form.startDate" mask="date" label="Pick-up Date">
                                <template v-slot:prepend>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="form.startDate">
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
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="form.endDate">
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
                        <q-btn type="submit" color="primary" label="Book Your Ride" />
                    </q-card-section>
                </q-card-section>
            </q-form>
        </q-card>
    </div>
</template>

<script setup lang="ts">

import { reactive } from 'vue'

const form: any = reactive({
    location: '',
    startDate: '',
    endDate: ''
});

function onSubmit() {
    if (form.location.value !== '' && form.startDate.value !== '' && form.endDate.value !== '') {
        console.log('form', form);
    }
}
</script>

<style>
.date-input {
    max-width: 300px;
}
</style>