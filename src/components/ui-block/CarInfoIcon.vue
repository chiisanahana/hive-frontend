<template>
    <div class="column">
        <div class="row items-center justify-center car-info-icon q-mb-sm">
            <q-icon v-if="props.asset == true" size="sm">
                <img :src="props.icon" class="icon">
            </q-icon>
            <q-icon v-else :name="props.icon" color="accent" size="sm" />
        </div>
        <div class="text-bold">{{ props.text }}</div>
        <div v-if="props.value">{{ props.value }}</div>
        <q-skeleton v-else type="text" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    icon: any;
    asset?: boolean;
    text: string;
    value?: string | number | undefined;
}>();
</script>

<style scoped>
.car-info-icon {
    width: 42px;
    height: 42px;
    border-radius: 4px;
    background-color: #ECF1FF;
}
</style>