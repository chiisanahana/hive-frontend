<template>
    <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 300px">
        <p>Input file</p>
        <!-- <div class="q-gutter-md" > -->
        <q-file outlined v-model="file">
            <template v-slot:prepend>
                <q-icon :name="ionAttach" />
            </template>
        </q-file>
        <!-- </div> -->
        <div>
            <q-btn label="Submit" type="submit" color="primary" />
        </div>
    </q-form>

    <img :src="fileUrl">
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FileService from '@/services/file.service'
import { ionAttach } from '@quasar/extras/ionicons-v6';

const file = ref<any>(undefined);
const fileUrl = ref<string>();

onMounted(() => {
    FileService.getFiles().then((response: any) => {
        console.log(response);
    })
});

function onSubmit() {
    console.log(file.value);

    const url = FileService.getFile('65e39e5e16b0ad1b1b96');
    fileUrl.value = url.href; 

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
}
</script>