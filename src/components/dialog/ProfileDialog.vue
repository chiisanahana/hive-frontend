<template>
    <q-dialog persistent style="min-width: 300px">
        <q-card class="container">
            <q-card-section>
                <div class="text-body1 text-bold q-mb-md">Ubah Foto Profil</div>
                <div class="q-pa-md">
                    <q-file v-model="file" outlined label="Pilih gambar" accept=".jpg, image/*" />
                </div>

            </q-card-section>
            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat color="accent" v-close-popup @click="file = undefined">Batal</q-btn>
                <q-btn color="accent" :disable="!isAnyFile()" @click="save">Simpan</q-btn>
            </q-card-actions>
            <q-inner-loading :showing="isLoading" />
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileService from '@/services/file.service';

const emit = defineEmits<{
    close: [fileId: string]
}>();

const file = ref<any>();
const isLoading = ref<boolean>(false);

function isAnyFile() {
    return file.value != undefined;
}

function save() {
    isLoading.value = true;
    console.log(file.value);
    FileService.uploadFile(file.value).then((response) => {
        console.log(response);
        emit('close', response.$id);
        isLoading.value = false;
    });
}
</script>