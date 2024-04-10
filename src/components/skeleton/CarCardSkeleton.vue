<template>
    <q-card v-ripple>
        <q-skeleton height="120px" />
        <q-card-section>
            <div><q-skeleton type="rect" /></div>
            <div class="row">
                <q-skeleton type="text" width="100px" />
                <q-space />
                <q-skeleton type="text" width="30px" />
            </div>
            <div class="row q-gutter-md q-mt-xs">
                <q-skeleton type="text" width="72px" />
                <q-skeleton type="text" width="72px" />
            </div>
        </q-card-section>
    </q-card>
</template>