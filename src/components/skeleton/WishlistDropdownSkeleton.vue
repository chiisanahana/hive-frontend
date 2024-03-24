<template>
    <q-item>
        <q-item-section thumbnail class="q-ml-none">
            <q-skeleton width="100px" height="56px" />
        </q-item-section>

        <q-item-section>
            <q-item-label><q-skeleton type="rect" /></q-item-label>
            <q-item-label caption>
                <div class="q-mb-xs">
                    <q-skeleton type="text" />
                </div>
                <div class="q-mb-xs">
                    <q-skeleton type="text" />
                </div>
                <div class="q-mb-xs">
                    <q-skeleton type="text" />
                </div>
            </q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-item-label>
                <q-skeleton type="rect" width="100px" />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>