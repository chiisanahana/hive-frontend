<template>
    <q-form @submit="onSubmit" class="q-gutter-md">
        <q-card flat bordered>
            <q-card-section>
                <div class="text-bold q-mb-lg">Car Information</div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Car Brand</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.brand"
                        placeholder="Example: Toyota Avanza G 1.5" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Car brand is required']" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Car Type</div>
                    <q-select outlined dense class="col" v-model="form.car_type" :options="carTypeOpt"
                        :rules="[(val) => (val && val != 'Choose category') || 'Car type is required']">
                    </q-select>
                </div>
            </q-card-section>
            <q-card-section>
                <div class="text-bold q-mb-lg">Car Details</div>
                <div class="row q-mb-lg self-top">
                    <div class="col-3 q-pt-sm">Car Photos</div>
                    <div class="col">
                        <q-uploader class="car-photos" color="primary" square flat bordered :factory="uploadFactory"
                            :filter="checkFileType" send-raw multiple auto-upload style="width: 100%;" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Year</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.year" mask="####"
                        lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Car year is required',
        (val) => (val <= '2024') || 'Car year is not valid'
    ]" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Vehicle Number</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.vehicle_no" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Vehicle number is required']" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Color</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.color" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Car color is required']" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Seat</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.seat" mask="##"
                        lazy-rules :rules="[(val) => (val && val.length > 0) || 'Car seat is required']" />
                </div>
                <div class="row q-mb-md">
                    <div class="col-3 q-pt-sm">Transmission</div>
                    <div class="q-gutter-sm">
                        <q-radio v-model="form.transmission" val="Automatic" label="Automatic" />
                        <q-radio v-model="form.transmission" val="Manual" label="Manual" />
                    </div>
                </div>
                <div class="row q-mb-md">
                    <div class="col-3 q-pt-sm">Fuel</div>
                    <div class="q-gutter-sm">
                        <q-radio v-model="form.fuel" val="1" label="Gasoline" />
                        <q-radio v-model="form.fuel" val="2" label="Electric" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Car Description</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense type="textarea"
                        v-model="form.description" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Car description is required']" />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="text-bold q-mb-lg">Pricing</div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Price per day</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.price" prefix="Rp"
                        @update:model-value="() => { clearLeadingZeros(form.price) }"
                        placeholder=" Input rent price per day" mask="###.###.###.###" reverse-fill-mask unmasked-value
                        lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Price per day is required',
        (val) => (form.price > '0') || 'Price is not valid'
    ]" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Deposit</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.deposit" prefix="Rp"
                        @update:model-value="() => { clearLeadingZeros(form.deposit) }" placeholder="Input rent deposit"
                        mask="###.###.###.###" reverse-fill-mask unmasked-value />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="text-bold q-mb-lg">Car Management</div>
                <div class="row">
                    <div class="col-3 q-pt-sm">
                        Car Status
                        <div class="q-mt-xs text-blue-grey-4">
                            If status is active, your car can be viewed by customers.
                        </div>
                    </div>
                    <q-toggle class="self-start" v-model="form.status" false-value="N" true-value="A"
                        :label="`${form.status == 'A' ? 'Active' : 'Inactive'}`" />
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn unelevated color="secondary" text-color="accent" label="Cancel" @click="showConfirm = true" />
                <q-btn unelevated color="primary" type="submit" label="Save" style="min-width: 120px;" />
            </q-card-actions>
        </q-card>
    </q-form>
    <ConfirmDialog v-model="showConfirm" :message="'Are you sure? Your changes will not be saved.'"
        action-btn-title="DON'T SAVE" @confirm-action="cancel()" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QSpinnerGears, useQuasar } from 'quasar';
import CarService from '@/services/car.service';
import CarFileService from '@/services/car.file.service';
import UserService from '@/services/user.service';
import FileService from '@/services/file.service';
import type { Car } from '@/interfaces/rest/Car';
import type { CarFile } from '@/interfaces/rest/CarFile';
import { isValidPrice } from '@/composables/validator';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { Message } from '@/enums/enum';

const props = defineProps<{
    car?: Car,
    isEdit?: boolean
}>();
const router = useRouter();
const quasar = useQuasar();
const showConfirm = ref<boolean>(false);
const form: any = reactive({
    provider_id: props.car?.provider_id || '',
    brand: props.car?.brand || '',
    car_type: props.car?.car_type || 'Choose category',
    year: props.car?.year || '',
    color: props.car?.color || '',
    seat: props.car?.seat || '',
    vehicle_no: props.car?.vehicle_no || '',
    transmission: props.car?.transmission || 'Automatic',
    fuel: props.car?.fuel || '1',
    price: props.car?.price || '0',
    deposit: props.car?.deposit || '0',
    description: props.car?.description || '',
    status: props.car?.status || 'A'
});
const photos = ref<CarFile[]>(props.car?.car_files || []);
const carTypeOpt = ref<string[]>([
    'Choose category',
    'Sedan',
    'SUV',
    'MPV',
    'Sport'
]);

function clearLeadingZeros(str: string) {
    form.price = form.price.replace(/^0+(?=\d)/, '');
    // console.log('price', form.price)
    // return str.replace(/^0+(?=\d)/, '');
}

function checkFileType(files: any) {
    return files.filter((file: File) => ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type));
}

function uploadFactory(file: any): Promise<Object> {
    // console.log('file', file);
    return new Promise((resolve, reject) => {
        FileService.uploadFile(file[0]).then((response) => {
            // console.log('response', response);
            photos.value.push({
                file_path: response.$id,
                file_type: response.mimeType.split('/')[1]
            });
            resolve({
                url: import.meta.env.VITE_Q_UPLOAD_URL
            });
        })
    });
}

function onSubmit() {
    quasar.loading.show({ spinner: QSpinnerGears });
    form.provider_id = UserService.getLoggedInPrv().id;

    // console.log('form', form);
    if (props.isEdit) {
        CarService.updateCar(form).then((response) => {
            quasar.loading.hide();
            router.push({ name: 'view-cars' });
            quasar.notify({
                color: 'positive',
                position: 'top-right',
                message: Message.CAR_UPDATE_SUCCESS
            });
        }).catch((error) => {
            quasar.loading.hide();
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
        });

    } else {
        CarService.addCar(form).then((response) => {
            // insert photos
            photos.value.forEach(photo => {
                photo.car_id = response.data.id;
                CarFileService.addCarPhoto(photo);
            });

            quasar.loading.hide();
            router.push({ name: 'view-cars' });
            quasar.notify({
                color: 'positive',
                position: 'top-right',
                message: Message.CAR_ADD_SUCCESS
            });

        }).catch((error) => {
            quasar.loading.hide();
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
        });
    }
}

function cancel() {
    router.push({ name: 'view-cars' });
}

onMounted(() => {
    if (props.isEdit) {
        // repush images
        
    }
});
</script>

<style scoped>
.img-container {
    border: 1px solid #FFFFFF;
    padding: 2px;
    border-radius: 4px;
}
</style>

<style>
.q-uploader.car-photos .q-uploader__list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 0;
    padding-left: 0;
}

.q-uploader.car-photos .q-uploader__file {
    width: 45%;
    margin-top: 8px;
    margin-left: 8px;
}
</style>