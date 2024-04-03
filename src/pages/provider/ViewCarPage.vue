<template>
    <div class="q-pa-md">
        <q-card flat>
            <q-card-section>
                <q-table flat bordered :rows="cars" :columns="columns" row-key="id"
                    :selected-rows-label="getSelectedString" selection="multiple" v-model:selected="selected"
                    class="text-font" :loading="isLoading" color="primary">
                    <template v-slot:top>
                        <div class="row col-12 items-center">
                            <div class="text-h6">Car List</div>
                            <q-space />
                            <div class="row q-gutter-x-sm">
                                <q-btn v-if="selected.length > 0" flat round class="rounded-borders" color="blue-grey-4"
                                    :icon="ionTrash" @click="showConfirm = true" />
                                <q-btn v-if="selected.length == 1" flat round class="rounded-borders" color="primary"
                                    icon="edit" @click="editCar(selected[0].id)" />
                                <q-btn round class="rounded-borders q-ml-lg" color="primary" :icon="ionAdd"
                                    @click="addCar" />
                            </div>
                        </div>
                    </template>

                    <template v-slot:body="props">
                        <q-tr :props="props" @click="onRowClick(props.row)">
                            <q-td>
                                <q-checkbox v-model="props.selected" color="primary" />
                            </q-td>
                            <q-td key="brand" :props="props">
                                <div class="row">
                                    <q-img class="rounded-borders q-mr-md" :src="getCarImg(props.row.car_files[0] || null)"
                                        :ratio="16 / 9" width="100px" />
                                    <div class="column">
                                        <div class="text-bold q-mb-xs">
                                            {{ props.row.brand }}
                                            <q-badge align="top" color="secondary" text-color="accent">
                                                {{ props.row.car_type }}
                                            </q-badge>
                                        </div>
                                        <div class="text-blue-grey-4">{{ props.row.vehicle_no }}</div>
                                    </div>
                                </div>
                            </q-td>
                            <q-td key="statistic" :props="props">
                                <div class="column items-center">
                                    <div class="row items-center q-mb-xs">
                                        <q-icon name="r_star" size="xs" color="warning" class="q-mr-xs" />
                                        <span class="text-bold">{{ props.row.rating }}</span>
                                    </div>
                                    <div class="row items-center">
                                        <div class="row items-center q-mr-md">
                                            <q-icon :name="ionEye" color="blue-grey-4" class="q-mr-xs" size="xs" />
                                            <span class="text-blue-grey-4">{{ props.row.click_count }}</span>
                                        </div>
                                        <div class="row items-center">
                                            <q-icon :name="ionCheckmarkCircle" color="blue-grey-4" class="q-mr-xs"
                                                size="xs" />
                                            <span class="text-blue-grey-4">{{ props.row.order_count }}</span>
                                        </div>
                                    </div>
                                </div>
                            </q-td>
                            <q-td key="price" :props="props">
                                {{ formatAmount(props.row.price) }}
                            </q-td>
                            <q-td key="deposit" :props="props">
                                {{ formatAmount(props.row.deposit) }}
                            </q-td>
                            <q-td key="status" :props="props">
                                <q-toggle v-model="props.row.status" false-value="N" true-value="A"
                                    @update:model-value="(val) => { toggleCarStatus(props.row.id, val) }" />
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
        <ConfirmDialog v-model="showConfirm"
            :message="selected.length > 1 ? 'Are you sure want to delete these cars?' : 'Are you sure want to delete this car?'"
            action-btn-title="Delete" @confirm-action="deleteCars(selected)" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import type { Car } from '@/interfaces/rest/Car';
import { formatAmount } from '@/composables/formatter';
import CarService from '@/services/car.service';
import UserService from '@/services/user.service';
import CryptoService from '@/services/crypto.service';
import { getCarImg } from '@/composables/getter';
import { Message } from '@/enums/enum';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { ionAdd, ionCheckmarkCircle, ionEye, ionTrash } from '@quasar/extras/ionicons-v6';

const router = useRouter();
const quasar = useQuasar();
const cars = ref<Car[]>([]);
const isLoading = ref<boolean>(false);
const selected = ref<any>([]);
const showConfirm = ref<boolean>(false);
const columns: QTableColumn[] = [
    { name: 'brand', align: 'left', label: 'Car Information', field: 'brand' },
    { name: 'statistic', align: 'center', label: 'Statistics', field: 'rating', sortable: true },
    { name: 'price', align: 'left', label: 'Price', field: 'price', sortable: true },
    { name: 'deposit', align: 'left', label: 'Deposit', field: 'deposit', sortable: true },
    { name: 'status', align: 'center', label: 'Active', field: 'status' }
]

function getSelectedString() {
    return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${cars.value.length}`
}

function onRowClick(row: any) {
    // console.log('row clicked', row.id);
    const encryptedId = CryptoService.encrypt(row.id);
    router.push({ name: 'view-car-details', query: { cid: encryptedId } })
}

function addCar() {
    router.push({ name: 'add-car' });
}

function editCar(id: number) {
    const encryptedId = CryptoService.encrypt(id);
    router.push({ name: 'edit-car', query: { cid: encryptedId } });
}

function getCars() {
    isLoading.value = true;
    CarService.getByProviderId(UserService.getLoggedInPrv().id)
        .then((response: any) => {
            isLoading.value = false;
            cars.value = response.data.filter((car: any) => { return car.isdelete == '0' });
        }).catch((e: Error) => {
            console.error(e);
            isLoading.value = false;
        });
}

function toggleCarStatus(rowId: number, value: any) {
    isLoading.value = true;
    CarService.updateCarStatus(rowId, value)
        .then((response) => {
            cars.value.map((car) => { if (car.id == rowId) car.status = response.data.status });
            isLoading.value = false;
        }).catch((error) => {
            // revert
            cars.value.map((car) => { if (car.id == rowId) car.status = value == 'A' ? 'N' : 'A' });
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
            isLoading.value = false;
        });
}

function deleteCars(cars: Car[]) {
    isLoading.value = true;
    cars.forEach((car: Car) => {
        // console.log('Delete car with id ' + car.id);
        CarService.deleteCar(car.id!)
            .then((response: any) => {
                selected.value = [];
                isLoading.value = false;
                getCars();
            }).catch((error) => {
                quasar.notify({
                    color: 'negative',
                    position: 'top-right',
                    message: Message.INTERNAL_SERVER_ERROR
                });
                isLoading.value = false;
            });
    });
}

onMounted(() => {
    getCars();
})
</script>