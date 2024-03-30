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
                        <!-- <q-uploader label="Main photo" color="primary" square flat bordered style="max-width: 300px"
                            @added="addPhoto" /> -->
                        <q-file style="max-width: 300px" v-model="filesImages" outlined
                            multiple accept=".jpg, .jpeg, .png" @rejected="onRejected" />
                    </div>
                    <!-- <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.brand" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Car photos is required']" /> -->
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
                        placeholder="Input rent deposit" />
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QSpinnerGears, useQuasar } from 'quasar';
import CarService from '@/services/car.service';
import UserService from '@/services/user.service';
import FileService from '@/services/file.service';
import type { Car } from '@/interfaces/rest/Car';
import { isValidPrice } from '@/composables/validator';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { Message } from '@/enums/enum';
import fileService from '@/services/file.service';
import type { CarFile } from '@/interfaces/rest/CarFile';

const props = defineProps<{
    car?: Car,
    isEdit?: boolean
}>();
const router = useRouter();
const quasar = useQuasar();
// const file = ref<any>(undefined);
const selectedFile = ref<File>(new File([''], ''));
const filesImages = ref(null);
const fileUrl = ref<string[]>([]);
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
const file_ids = ref<string[]>([]);
const carTypeOpt = ref<string[]>([
    'Choose category',
    'Sedan',
    'MPV',
    'Sport'
]);

const emit = defineEmits<{
    (e: 'uploaded', arg: URL): void
}>()

function onRejected (rejectedEntries:any) {
    console.log(`${rejectedEntries.length} file(s) did not pass validation constraints`);
}

function clearLeadingZeros(str: string) {
    form.price = form.price.replace(/^0+(?=\d)/, '');
    console.log('price', form.price)
    // return str.replace(/^0+(?=\d)/, '');
}

function uploadFactory(file: any) {
    // let vm = this,
    //     data = new FormData();
    return new Promise((resolve, reject) => {
        //     this.$axios.post('/upload', data, {
        //         headers: { 'Content-Type': 'multipart/form-data' }
        //     })
        //         .then(response => {
        //             resolve(file);
        //         })
        //         .catch(error => reject(error))
        // });
        FileService.uploadFile(selectedFile.value).then((response) => {
            console.log('response', response);
            // resolve(response.data);
            resolve(`https://cloud.appwrite.io/v1/storage/buckets/65e38f60cf5a571e4c30/files`);
            // resolve(null);
        })
    });
}

// function addPhoto(files: readonly any[]) {
//     console.log(files);
//     selectedFile.value = files[0];
//     console.log(selectedFile.value);
//     uploadFile();
// }

// function uploadFile() {
//     // FileService.uploadFile(selectedFile.value).then((response) => {
//     //     console.log(response.data);
//     //     console.log(response.data.$id);
//     //     file_ids.value.push(response.data.$id);
//     // })
//     let fd = new FormData();
//     fd.append('file', selectedFile.value)
//     doUpload(fd).then((url) => {
//         console.log('url', url)
//         emit('uploaded', url)
//     })

// }

// function doUpload(data: FormData): Promise<any> {
//     return new Promise((resolve, reject) => {
//         //     axios({ url: `${apiURL}api/v1/fileupload`, method: 'POST', data })
//         //         .then((resp: any) => {
//         //             resolve(resp.data)
//         //         })
//         FileService.uploadFile(selectedFile.value).then((response) => {
//             console.log(response);
//             // resolve(response.data);
//             // resolve(`https://cloud.appwrite.io/v1/storage/buckets/65e38f60cf5a571e4c30/files`);
//             resolve(null);
//         })
//     })
// }

// onMounted(() => {
//     FileService.getFiles().then((response: any) => {
//         console.log(response);
//     })
// });

// function factoryFn(file: File) {
//     // console.log(file);
//     FileService.uploadFile(file).then((response) => {
//         console.log(response);
//         fileUrl.value.push(response.id);
//     });
// }

function onSubmit() {
    quasar.loading.show({ spinner: QSpinnerGears });
    form.provider_id = UserService.getLoggedInPrv().id;

    console.log('form', form);
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

// console.log(file.value);

// const url = FileService.getFile('65e39e5e16b0ad1b1b96');
// fileUrl.value = url.href;

// FileService.uploadFile(file.value).then((response: any) => {
//     console.log(response);

// {
// "$id": "65e39e5e16b0ad1b1b96",
// "bucketId": "65e38f60cf5a571e4c30",
// "$createdAt": "2024-03-02T21:47:10.348+00:00",
// "$updatedAt": "2024-03-02T21:47:10.348+00:00",
// "$permissions": [],
// "name": "KJ_icon4_06.png",
// "signature": "29cbc823fd62366e720fb3a9d14dd99e",
// "mimeType": "image/png",
// "sizeOriginal": 64593,
// "chunksTotal": 1,
// "chunksUploaded": 1
// }
// })
// }

function cancel() {
    router.push({ name: 'view-cars' });
}
</script>