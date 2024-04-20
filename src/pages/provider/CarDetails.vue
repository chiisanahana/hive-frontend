<template>
    <div class="q-pa-md col-12">
        <q-card flat>
            <q-card-section horizontal>
                <q-card-section class="col-8">
                    <CarCarousel v-if="car != undefined" :photos="car.car_files" />
                </q-card-section>
                <q-card-section>
                    <div class="text-h6 text-bold">{{ car?.brand }}</div>
                    <div class="text-body1 q-mb-md">{{ car?.vehicle_no }}</div>
                    <div class="row">
                        <div class="text-body1">{{ formatAmount(car?.price) }}</div>
                        <span class="text-body1 text-blue-grey-4 q-ml-sm">/hari</span>
                    </div>
                    <div class="text-body1">
                        {{ car?.deposit! > 0 ? 'Deposit ' + formatAmount(car?.deposit) : 'Tanpa deposit' }}
                    </div>
                </q-card-section>
            </q-card-section>
            <q-card-section>
                <div class="text-body1 text-bold q-mb-sm">Informasi Mobil</div>
                <div class="row q-gutter-x-md">
                    <CarInfoIcon :icon="ionCarSport" :text="'Tipe'" :value="car?.car_type" />
                    <CarInfoIcon :icon="ionCalendarClear" :text="'Tahun'" :value="car?.year" />
                    <CarInfoIcon :icon="chairAlt" :asset="true" :text="'Kursi'" :value="car?.seat" />
                    <CarInfoIcon :icon="ionColorPalette" :text="'Warna'" :value="car?.color" />
                    <CarInfoIcon :icon="autoTransmission" :asset="true" :text="'Transmisi'"
                        :value="getCarTransmission(car)" />
                    <CarInfoIcon :icon="ionSpeedometer" :text="'Bahan Bakar'" :value="getCarFuel(car)" />
                    <q-space />
                    <div class="rating-box column q-pa-md">
                        <div class="row items-center q-mb-sm">
                            <q-icon name="r_star" size="sm" color="warning" class="q-mr-sm" />
                            <span class="text-bold">{{ car?.rating }}</span>
                        </div>
                        <div>Disewa {{ car?.order_count }} kali</div>
                    </div>
                </div>
            </q-card-section>
            <q-separator inset />
            <q-card-section>
                <div class="text-body1 text-bold q-mb-sm">Deskripsi</div>
                <div class="text-body1" style="white-space: pre-wrap">{{ car?.description }}</div>
            </q-card-section>
            <q-card-actions>
                <q-btn unelevated color="secondary" :icon="ionChevronBack" label="Kembali" text-color="accent"
                    @click="goBack" no-caps />
            </q-card-actions>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import { useRoute, useRouter } from 'vue-router'
import type { Car } from '@/interfaces/rest/Car';
import CarService from '@/services/car.service';
import CryptoService from '@/services/crypto.service';
import { formatAmount } from '@/composables/formatter';
import CarCarousel from '@/components/ui-block/CarCarousel.vue';
import CarInfoIcon from '@/components/ui-block/CarInfoIcon.vue';
import { ionChevronBack, ionCarSport, ionCalendarClear, ionColorPalette, ionSpeedometer } from '@quasar/extras/ionicons-v6';
import autoTransmission from '@/assets/icons/auto_transmission.svg';
import chairAlt from '@/assets/icons/chair_alt.svg';
import { getCarFuel, getCarTransmission } from '@/composables/getter';

const route = useRoute();
const router = useRouter();
const quasar = useQuasar();
const car = ref<Car>();

watch(
    () => route.query.cid,
    async newId => {
        getCar(parseInt(CryptoService.decrypt(newId?.toString() || '')))
    }
)

function goBack() {
    router.go(-1);
}

function getCar(carId: number) {
    quasar.loading.show({ spinner: QSpinnerGears });
    CarService.get(carId).then((response: any) => {
        // console.log(response);
        car.value = response.data;
        quasar.loading.hide();
    }).catch((e: Error) => {
        console.error(e);
        quasar.loading.hide();
    });
}

onBeforeMount(() => {
    // load car data
    const carId = route.query.cid;
    if (typeof carId === 'string') {
        getCar(parseInt(CryptoService.decrypt(carId)));
    }
});
</script>

<style scoped>
.rating-box {
    background-color: #ECF1FF;
    border-radius: 4px;
}
</style>

<style>
.q-bottom-sheet--list img {
    width: 42px;
    height: auto;
}
</style>