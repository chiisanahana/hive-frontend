<template>
    <q-form @submit="onSubmit" class="q-gutter-md">
        <q-card flat bordered>
            <q-card-section>
                <div class="text-bold q-mb-lg">Informasi Mobil</div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Merk Mobil</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.brand"
                        placeholder="Contoh: Toyota Avanza G 1.5" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Merk mobil tidak dapat dikosongkan']" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Tipe Mobil</div>
                    <q-select outlined dense class="col" v-model="form.car_type" :options="carTypeOpt"
                        :rules="[(val) => (val && val != 'Pilih kategori') || 'Tipe mobil tidak dapat dikosongkan']">
                    </q-select>
                </div>
            </q-card-section>
            <q-card-section>
                <div class="text-bold q-mb-lg">Detail Mobil</div>
                <div class="row q-mb-lg self-top">
                    <div class="col-3 q-pt-sm">Foto Mobil</div>
                    <div class="col">
                        <q-uploader class="car-photos" color="primary" square flat bordered :factory="uploadFactory"
                            :filter="checkFileType" send-raw multiple auto-upload style="width: 100%;" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Tahun Pembuatan</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.year" mask="####"
                        lazy-rules :rules="[
                            (val) => (val && val.length > 0) || 'Tahun pembuatan mobil tidak dapat dikosongkan',
                            (val) => (val <= '2024') || 'Tahun pembuatan mobil tidak valid'
                        ]" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Plat Nomor</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.vehicle_no" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Plat nomor tidak dapat dikosongkan']" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Warna</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.color" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Warna mobil tidak dapat dikosongkan']" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Jumlah Kursi</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.seat" mask="##"
                        lazy-rules :rules="[(val) => (val && val.length > 0) || 'Jumlah kursi tidak dapat dikosongkan']" />
                </div>
                <div class="row q-mb-md">
                    <div class="col-3 q-pt-sm">Transmisi</div>
                    <div class="q-gutter-sm">
                        <q-radio v-model="form.transmission" val="1" label="Otomatis" />
                        <q-radio v-model="form.transmission" val="2" label="Manual" />
                    </div>
                </div>
                <div class="row q-mb-md">
                    <div class="col-3 q-pt-sm">Bahan Bakar</div>
                    <div class="q-gutter-sm">
                        <q-radio v-model="form.fuel" val="1" label="Bensin" />
                        <q-radio v-model="form.fuel" val="2" label="Elektrik" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Deskripsi</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense type="textarea"
                        v-model="form.description" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || 'Deskripsi mobil tidak dapat dikosongkan']" />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="text-bold q-mb-lg">Harga</div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Harga sewa per hari</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.price" prefix="Rp"
                        @update:model-value="() => { form.price = clearLeadingZeros(form.price) }"
                        placeholder="Masukkan harga sewa" mask="###.###.###.###" reverse-fill-mask unmasked-value
                        lazy-rules :rules="[
                            (val) => (val && val.length > 0) || 'Harga tidak dapat dikosongkan',
                            (val) => (parseInt(val) > 0) || 'Harga tidak valid'
                        ]" />
                </div>
                <div class="row">
                    <div class="col-3 q-pt-sm">Deposit</div>
                    <q-input class="col" style="min-width: 200px;" outlined dense v-model="form.deposit" prefix="Rp"
                        @update:model-value="() => { clearLeadingZeros(form.deposit) }" placeholder="Masukkan harga deposit"
                        mask="###.###.###.###" reverse-fill-mask unmasked-value />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="text-bold q-mb-lg">Manajemen Mobil</div>
                <div class="row">
                    <div class="col-3 q-pt-sm">
                        Status Mobil
                        <div class="q-mt-xs text-blue-grey-4">
                            Jika status aktif, mobil akan muncul dalam hasil pencarian oleh penyewa.
                        </div>
                    </div>
                    <q-toggle class="self-start" v-model="form.status" false-value="0" true-value="1"
                        :label="`${form.status == '1' ? 'Aktif' : 'Inaktif'}`" />
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn unelevated color="secondary" text-color="accent" label="Batal" @click="showConfirm = true" />
                <q-btn unelevated color="primary" type="submit" label="Simpan" style="min-width: 120px;" />
            </q-card-actions>
        </q-card>
    </q-form>
    <ConfirmDialog v-model="showConfirm" message="Apakah Anda yakin? Perubahan Anda tidak akan disimpan."
        action-btn-title="JANGAN SIMPAN" @confirm-action="cancel()" />
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
    car_type: props.car?.car_type || 'Pilih kategori',
    year: props.car?.year || '',
    color: props.car?.color || '',
    seat: props.car?.seat || '',
    vehicle_no: props.car?.vehicle_no || '',
    transmission: props.car?.transmission || 'Otomatis',
    fuel: props.car?.fuel || '1',
    price: props.car?.price || '0',
    deposit: props.car?.deposit || '0',
    description: props.car?.description || '',
    status: props.car?.status || 'A'
});
const photos = ref<CarFile[]>(props.car?.car_files || []);
const carTypeOpt = ref<string[]>([
    'Pilih kategori',
    'Sedan',
    'SUV',
    'MPV',
    'Hatchback'
]);

function clearLeadingZeros(str: string) {
    // form.price = form.price.replace(/^0+(?=\d)/, '');
    // console.log('price', form.price)
    return str.replace(/^0+(?=\d)/, '');
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