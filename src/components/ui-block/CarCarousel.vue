<template>
    <div>
        <q-responsive :ratio="16/9">
            <q-carousel animated v-model="slide" arrows navigation infinite height="auto">
                <q-carousel-slide v-for="i in urls.length" :key="i" :name="i" :img-src="urls[i - 1]" />
            </q-carousel>
        </q-responsive>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import type { CarFile } from '@/interfaces/rest/CarFile';
import FileService from '@/services/file.service';

const props = defineProps<{
    photos: CarFile[]
}>();
const slide = ref<number>(1);
const urls = ref<string[]>([]);

function getImg(path: string): string {
    return FileService.getFile(path).href;
}

onBeforeMount(() => {
    for (let index = 0; index < props.photos.length; index++) {
        urls.value.push(getImg(props.photos[index].file_path))
    }
});
</script>