<template>
  <Header />
  <main>
    <h4>HiVe</h4>
    <p>promosipromosipromosi...</p>
    <div class="row justify-center">
      <q-card class="search-card col-10 q-pa-md">
        <q-form @submit="onSubmit">
          <q-card-section horizontal class="justify-between">
            <q-card-section>
              <!-- Choose your location
            <q-input dense outlined v-model="location" /> -->
              <q-input outlined dense v-model="form.location" label="Choose your Location">
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
                <!-- <template v-slot:append v-if="location != ''">
                <q-icon name="close" @click="location = ''" class="cursor-pointer" />
              </template> -->
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
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/layouts/Header.vue'

const router = useRouter();

const form: any = reactive({
  location: '',
  startDate: '',
  endDate: ''
});

function onSubmit() {
  if (form.location.value !== '' && form.startDate.value !== '' && form.endDate.value !== '') {
    console.log('form', form);
    router.push({ name: "cars" });
  }
}
</script>

<style>
.date-input {
  max-width: 300px;
}
</style>