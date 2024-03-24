<template>
    <div :class="'column ' + props.customClass">
        <label class="q-mb-xs row items-center">
            <q-icon :name="props.icon" size="xs" class="q-mr-xs" />
            {{ props.text }}
        </label>
        <div class="field-value">{{ props.value }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    icon: any;
    asset?: boolean;
    text: string;
    value: string | number | undefined;
    customClass?: string;
}>();
</script>

<style scoped>
.date-field {
    width: 160px;
}

.time-field {
    width: 120px;
}

.field-value {
    padding: 6px 12px;
    line-height: 28px;
    border-radius: 4px;
    background-color: #ECF1FF;
}
</style>