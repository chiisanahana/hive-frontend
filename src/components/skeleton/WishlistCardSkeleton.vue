<template>
    <q-card flat bordered class="q-mb-md">
        <q-card-section class="q-pa-sm">
            <div class="row">
                <div class="column justify-center q-mr-lg">
                    <q-skeleton width="120px" height="64px" />
                </div>
                <div class="column">
                    <div class="q-mb-sm"><q-skeleton type="rect" /></div>
                    <q-skeleton type="text" width="200px" />
                    <q-skeleton type="text" width="200px" />
                    <q-skeleton type="text" width="150px" />
                </div>
                <q-space />
                <div class="column q-mr-md justify-center items-end">
                    <div><q-skeleton type="text" width="50px" /></div>
                    <div><q-skeleton type="rect" width="100px" /></div>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>