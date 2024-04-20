import type { ionChevronDown } from '@quasar/extras/ionicons-v6';
<template>
    <q-card flat>
        <q-card-section>
            <div class="row q-mb-md">
                <div class="text-body1 text-bold ">Detail Pembayaran</div>
                <q-space />
                <q-skeleton type="QBadge" />
            </div>
            <div class="q-gutter-sm q-mb-lg">
                <div v-for="i in 4" class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-skeleton type="text" width="50%" />
                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <q-skeleton type="text" width="50%" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4">
                        <q-skeleton type="text" width="50%" />
                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <q-skeleton type="text" width="40%" height="30px" />
                    </div>
                    <q-space />
                    <q-icon :name="ionChevronDown" size="sm" color="grey-7" />
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { ionChevronDown } from '@quasar/extras/ionicons-v6';


</script>