<template>
    <q-card-section>
        <div class="text-body1 text-bold q-mb-sm">Detail Penyewaan</div>
        <div class="column q-mb-md">
            <div class="text-body2 text-bold text-accent q-mb-sm">Pengambilan</div>
            <div v-if="props.editable" class="column q-mb-md">
                <label class="q-mb-xs row items-center">
                    <q-icon :name="ionLocation" size="xs" class="q-mr-xs" />
                    Alamat
                </label>
                <q-input outlined dense v-model="pickupAddress" placeholder="Alamat pengambilan"
                    :rules="[(val) => (val && val.length > 0) || 'Alamat pengambilan tidak dapat dikosongkan']" hide-bottom-space />
            </div>
            <RentInfoLabel v-else :icon="ionLocation" :text="'Alamat'"
                :value="props.rentDetails?.pickupAddress" :custom-class="'q-mb-md'" />

            <div class="row q-gutter-md">
                <RentInfoLabel :icon="ionCalendar" :text="'Tanggal'"
                    :value="formatDateDisplay(props.rentDetails?.startDate)" :customClass="'date-field'" />
                <RentInfoLabel :icon="ionTime" :text="'Waktu'" :value="props.rentDetails?.startTime"
                    :customClass="'time-field'" />
            </div>
        </div>
        <div class="column q-mb-md">
            <div class="text-body2 text-bold text-accent q-mb-sm">Pengembalian</div>
            <div v-if="props.editable" class="column q-mb-md">
                <label class="q-mb-xs row items-center">
                    <q-icon :name="ionLocation" size="xs" class="q-mr-xs" />
                    Alamat
                </label>
                <q-input outlined dense v-model="returnAddress" placeholder="Alamat pengembalian"
                    :rules="[(val) => (val && val.length > 0) || 'Alamat pengembalian tidak dapat dikosongkan']" hide-bottom-space />
            </div>
            <RentInfoLabel v-else :icon="ionLocation" :text="'Alamat'"
                :value="props.rentDetails?.returnAddress" :custom-class="'q-mb-md'" />

            <div class="row q-gutter-md">
                <RentInfoLabel :icon="ionCalendar" :text="'Tanggal'" :value="formatDateDisplay(props.rentDetails?.endDate)"
                    :customClass="'date-field'" />
                <RentInfoLabel :icon="ionTime" :text="'Waktu'" :value="props.rentDetails?.endTime"
                    :customClass="'time-field'" />
            </div>
        </div>
    </q-card-section>
</template>

<script setup lang="ts">
import { formatDateDisplay } from '@/composables/formatter';
import type { RentDetails } from '@/interfaces/RentDetails';
import RentInfoLabel from '@/components/ui-block/RentInfoLabel.vue';
import { ionLocation, ionCalendar, ionTime } from '@quasar/extras/ionicons-v6';

const props = defineProps<{
    editable: boolean,
    rentDetails: RentDetails | undefined
}>();

const pickupAddress = defineModel<string, string>('pickupAddress');
const returnAddress = defineModel<string, string>('returnAddress');

</script>