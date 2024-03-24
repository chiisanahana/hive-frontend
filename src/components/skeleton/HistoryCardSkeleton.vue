<template>
    <q-card flat bordered class="q-mb-md">
        <q-card-section class="q-pa-sm">
            <div class="row items-center q-gutter-x-md q-mb-md">
                <div><q-skeleton type="text" width="80px" /></div>
                <q-skeleton type="QBadge" width="100px" />
            </div>

            <div class="row">
                <div class="column justify-center q-mr-lg">
                    <q-skeleton width="120px" height="64px" />
                </div>
                <div class="column">
                    <div class="q-mb-sm"><q-skeleton type="rect" width="150px" /></div>
                    <q-skeleton type="text" width="150px" />
                    <q-skeleton type="text" width="150px" />
                </div>
                <q-space />
                <div class="column q-mr-md">
                    <div><q-skeleton type="text" width="50px" /></div>
                    <div><q-skeleton type="rect" width="100px" /></div>
                </div>
            </div>
            <q-card-actions align="right">
                <div class="row q-gutter-x-md">
                    <q-skeleton type="text" width="90px" />
                    <q-skeleton type="QBtn" width="140px" />
                </div>
            </q-card-actions>
        </q-card-section>
    </q-card>
</template>