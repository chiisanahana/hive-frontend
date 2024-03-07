<template>
    <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
            <q-breadcrumbs-el v-for="i in items" :icon="i.icon" :label="i.label" :to="i.ref" />
        </q-breadcrumbs>
    </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@/interfaces/BreadcrumbItem';

const props = defineProps<{
    items: BreadcrumbItem[]
}>();
</script>