<template>
    <q-dialog persistent>
        <q-card class="q-pa-md">
            <q-card-section class="row items-center">
                <q-avatar :icon="ionWarning" color="warning" text-color="white" class="q-mr-md" />
                <div class="column q-gutter-sm">
                    <span>{{ message }}</span>
                    <span class="text-blue-grey-4">{{ hint }}</span>
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat color="accent" v-close-popup>{{ cancelBtnTitle }}</q-btn>
                <q-btn flat color="negative" v-close-popup @click="$emit('confirmAction')">{{ actionBtnTitle }}</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ionWarning } from '@quasar/extras/ionicons-v6';

const props = withDefaults(defineProps<{
    message: string
    actionBtnTitle: string
    cancelBtnTitle?: string,
    hint?: string
}>(), { 
    cancelBtnTitle: 'Batal',
    hint: 'Tindakan ini tidak dapat dikembalikan.'
 });

const emit = defineEmits<{
    confirmAction: []
}>();
</script>