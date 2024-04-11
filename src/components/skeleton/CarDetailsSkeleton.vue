import { ionCarSport } from '@quasar/extras/ionicons-v6';
<template>
    <q-card flat>
        <q-card-section horizontal>
            <q-card-section class="col-8">
                <q-skeleton width="500px" height="300px" />
            </q-card-section>
            <q-card-section>
                <q-skeleton type="rect" width="130px" />
                <q-skeleton type="text" width="130px" class="q-mb-md" />
                <q-skeleton type="text" width="130px" />
                <q-skeleton type="text" width="130px" />
            </q-card-section>
        </q-card-section>
        <q-card-section>
            <div class="text-body1 text-bold q-mb-sm">Car Info</div>
            <div class="row q-gutter-x-md">
                <CarInfoIcon :icon="ionCarSport" :text="'Car Type'" />
                <CarInfoIcon :icon="ionCalendarClear" :text="'Year'" />
                <CarInfoIcon :icon="chairAlt" :asset="true" :text="'Seats'" />
                <CarInfoIcon :icon="ionColorPalette" :text="'Color'" />
                <CarInfoIcon :icon="ionSpeedometer" :text="'Fuel'" />
                <CarInfoIcon :icon="autoTransmission" :asset="true" :text="'Transmission'" />
                <q-space />
                <div class="rating-box column q-pa-md">
                    <div class="row items-center q-mb-sm">
                        <q-icon name="r_star" size="sm" color="warning" class="q-mr-sm" />
                        <q-skeleton type="text" width="40px" />
                    </div>
                    <q-skeleton type="text" width="100px" />
                </div>
            </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
            <div class="text-body1 text-bold q-mb-sm">Description</div>
            <q-skeleton type="text" />
            <q-skeleton type="text" />
            <q-skeleton type="text" />
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { ionCarSport, ionCalendarClear, ionColorPalette, ionSpeedometer } from '@quasar/extras/ionicons-v6';
import autoTransmission from '@/assets/icons/auto_transmission.svg';
import chairAlt from '@/assets/icons/chair_alt.svg';
import CarInfoIcon from '@/components/ui-block/CarInfoIcon.vue';
</script>

<style scoped>
.rating-box {
    background-color: #ECF1FF;
    border-radius: 4px;
}
</style>