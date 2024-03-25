<template>
    <div class="row q-pa-md container">
        <div class="col-auto q-mr-md" style="width: 270px;">
            <q-scroll-area class="fit">
                <div class="q-pa-md filter-box ">
                    <div class="row">
                        <div class="row items-center q-mb-xs">
                            <q-icon name="filter_alt" class="q-mr-xs" size="xs" />
                            <div class="text-bold">Filter</div>
                        </div>
                        <q-space />
                        <q-btn flat text-color="accent" label="Reset" no-caps @click="resetFilter" />
                    </div>
                    <div class="column">
                        <q-expansion-item label="PRICE RANGE" :expand-icon="ionChevronDown"
                            header-class="text-bold filter-category" default-opened dense-toggle>
                            <q-card>
                                <div class="row items-center q-gutter-sm q-mb-sm">
                                    <div class="col">
                                        <q-input debounce="500" dense standout="bg-white" v-model="filter.priceMin"
                                            bg-color="secondary" input-class="text-font" placeholder="0" />
                                    </div>
                                    <div class="col-auto">-</div>
                                    <div class="col">
                                        <q-input debounce="500" dense standout="bg-white" v-model="filter.priceMax"
                                            bg-color="secondary" input-class="text-font" placeholder="9.999.999" />
                                    </div>
                                </div>
                            </q-card>
                        </q-expansion-item>
                        <q-separator class="q-mt-xs" />
                        <q-expansion-item label="CAR TYPE" :expand-icon="ionChevronDown"
                            header-class="text-bold filter-category" default-opened dense-toggle>
                            <q-card>
                                <div class="column q-gutter-sm q-mb-sm">
                                    <q-checkbox dense v-model="filter.carType" val="Sedan" label="Sedan"
                                        color="accent" />
                                    <q-checkbox dense v-model="filter.carType" val="SUV" label="SUV" color="accent" />
                                    <q-checkbox dense v-model="filter.carType" val="MPV" label="MPV" color="accent" />
                                    <q-checkbox dense v-model="filter.carType" val="Sport" label="Sport"
                                        color="accent" />
                                </div>
                            </q-card>
                        </q-expansion-item>
                        <q-separator class="q-mt-xs" />
                        <q-expansion-item label="YEAR" :expand-icon="ionChevronDown"
                            header-class="text-bold filter-category" default-opened dense-toggle>
                            <q-card>
                                <div class="row items-center q-gutter-sm q-mb-sm">
                                    <div class="col">
                                        <q-input debounce="500" dense standout="bg-white" v-model="filter.yearMin"
                                            bg-color="secondary" input-class="text-font" mask="####"
                                            placeholder="1999" />
                                    </div>
                                    <div class="col-auto">-</div>
                                    <div class="col">
                                        <q-input debounce="500" dense standout="bg-white" v-model="filter.yearMax"
                                            bg-color="secondary" input-class="text-font" mask="####"
                                            placeholder="2024" />
                                    </div>
                                </div>
                            </q-card>
                        </q-expansion-item>
                        <q-separator class="q-mt-xs" />
                        <q-expansion-item label="SEAT" :expand-icon="ionChevronDown"
                            header-class="text-bold filter-category" default-opened dense-toggle>
                            <q-card>
                                <div class="column q-gutter-sm q-mb-sm">
                                    <q-checkbox dense v-model="filter.seat" val="4" label="4 Seater" color="accent" />
                                    <q-checkbox dense v-model="filter.seat" val="6" label="6 Seater" color="accent" />
                                    <q-checkbox dense v-model="filter.seat" val="8" label="8 Seater" color="accent" />
                                </div>
                            </q-card>
                        </q-expansion-item>
                        <q-separator class="q-mt-xs" />
                        <q-expansion-item label="TRANSMISSION" :expand-icon="ionChevronDown"
                            header-class="text-bold filter-category" default-opened dense-toggle>
                            <q-card>
                                <div class="column q-gutter-sm q-mb-sm">
                                    <q-checkbox dense v-model="filter.transmission" val="Automatic" label="Automatic"
                                        color="accent" />
                                    <q-checkbox dense v-model="filter.transmission" val="Manual" label="Manual"
                                        color="accent" />
                                </div>
                            </q-card>
                        </q-expansion-item>
                        <q-separator class="q-mt-xs" />
                        <q-expansion-item label="FUEL" :expand-icon="ionChevronDown"
                            header-class="text-bold filter-category" default-opened dense-toggle>
                            <q-card>
                                <div class="column q-gutter-sm">
                                    <q-checkbox dense v-model="filter.fuel" val="1" label="Gasoline" color="accent" />
                                    <q-checkbox dense v-model="filter.fuel" val="2" label="Electric" color="accent" />
                                </div>
                            </q-card>
                        </q-expansion-item>
                    </div>
                </div>
            </q-scroll-area>
        </div>

        <div class="col q-gutter-y-md items-center">
            <CarSearchForm :form-value="rentDetails" :route-to="''" />

            <div v-if="isLoading" class="row q-px-md q-gutter-md">
                <CarCardSkeleton v-for="n in 8" :key="n" />
            </div>
            <div v-else-if="cars.length == 0">
                Oops... No cars available
            </div>
            <div v-else class="row q-px-md q-gutter-md">
                <CarCard v-for="car in cars" :car="car" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeMount, toRaw } from 'vue';
import type { Car } from '@/interfaces/rest/Car';
import type { RentDetails } from '@/interfaces/RentDetails';
import CarService from '@/services/car.service';
import CryptoService from '@/services/crypto.service';
import CarSearchForm from '@/components/forms/CarSearchForm.vue';
import CarCardSkeleton from '@/components/skeleton/CarCardSkeleton.vue';
import CarCard from '@/components/cards/CarCard.vue';
import { ionChevronDown } from '@quasar/extras/ionicons-v6';

const isLoading = ref<boolean>(true);
const data = ref<Car[]>([]);
const cars = ref<Car[]>([]);
const rentDetails = ref<RentDetails>();
const filter: any = reactive({
    priceMin: '',
    priceMax: '',
    carType: [],
    yearMin: '',
    yearMax: '',
    seat: [],
    transmission: [],
    fuel: []
});

watch(filter, async (newFilter, oldFilter) => {
    // construct query
    let query: any = {};
    if (filter.carType.length > 0) query.car_type = filter.carType;
    if (filter.seat.length > 0) query.seat = filter.seat;
    if (filter.transmission.length > 0) query.transmission = toRaw(filter.transmission);
    if (filter.fuel.length > 0) query.fuel = filter.fuel;

    filterCar(query);
})

function getCars() {
    // CarService.getAll().then((response: any) => {
    //     console.log(response);
    //     isLoading.value = false;
    //     data.value = response.data;
    //     cars.value = response.data;//.concat(response.data);
    // }).catch((e: Error) => {
    //     console.error(e);
    // });

    CarService.searchCar(rentDetails.value!)
        .then((response: any) => {
            // console.log(response);
            isLoading.value = false;
            data.value = response.data;
            cars.value = data.value;
        }).catch((e: Error) => {
            isLoading.value = false;
            console.error(e);
        });
}

function priceFilter(cars: Car[]) {
    const min = (filter.priceMin != '' && filter.priceMin != undefined) ? filter.priceMin as number : 0;
    const max = (filter.priceMax != '' && filter.priceMax != undefined) ? filter.priceMax as number : Number.MAX_SAFE_INTEGER;

    return cars.filter((car: any) => {
        return parseInt(car.price) >= min && parseInt(car.price) <= max;
    })
}

function yearFilter(cars: Car[]) {
    const min = (filter.yearMin != '' && filter.yearMin != undefined) ? filter.yearMin as number : 0;
    const max = (filter.yearMax != '' && filter.yearMax != undefined) ? filter.yearMax as number : Number.MAX_SAFE_INTEGER;

    return cars.filter((car: any) => {
        return parseInt(car.year) >= min && parseInt(car.year) <= max;
    })
}

function filterCar(filter: any) {
    isLoading.value = true;
    cars.value = data.value;

    if (Object.keys(filter).length > 0) {
        cars.value = cars.value.filter((car: any) => {
            let result;
            for (var key in filter) {
                filter[key].every((value: any) => {
                    if (car[key] === undefined || car[key] != value) {
                        result = false;
                        return true;
                    } else {
                        result = true;
                        return false;
                    }
                });
                if (result == false) break;
            }
            return result;
        });
    }

    cars.value = priceFilter(cars.value);
    cars.value = yearFilter(cars.value);
    isLoading.value = false;
}

function resetFilter() {
    filter.priceMin = filter.priceMax = filter.yearMin = filter.yearMax = '';
    filter.carType = filter.seat = filter.transmission = filter.fuel = [];
    cars.value = data.value;
}

onBeforeMount(() => {
    const data = localStorage.getItem(import.meta.env.VITE_SESSION_DATA);
    if (data != null) {
        rentDetails.value = JSON.parse(CryptoService.decrypt(data));
        // console.log('rent data', rentDetails.value);
    }
});

onMounted(() => {
    getCars();
})
</script>

<style scoped>
.container {
    height: calc(100vh - 69px);
}

.car-card {
    width: calc(100% / 4 - 16px);
    height: fit-content;
}

.filter-box {
    background-color: #FFFFFF;
    border-radius: 4px;
}
</style>

<style>
.q-item.filter-category {
    padding-left: 0;
}
</style>