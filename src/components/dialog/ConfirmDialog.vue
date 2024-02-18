<template>
    <q-dialog persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="warning" color="warning" text-color="white" />
                <span class="q-ml-sm">{{ message }}</span>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat color="primary" v-close-popup>{{ cancelBtnTitle }}</q-btn>
                <q-btn flat color="negative" v-close-popup @click="$emit('confirmAction')">{{ actionBtnTitle }}</q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    message: string
    actionBtnTitle: string
    cancelBtnTitle?: string
}>(), { cancelBtnTitle: 'Cancel' });

const emit = defineEmits<{
    confirmAction: []
}>();
</script>