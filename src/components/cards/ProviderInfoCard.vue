<template>
    <q-card flat>
        <q-card-section v-if="provider">
            <div class="text-body1 text-bold q-mb-sm">Provider</div>
            <div class="row">
                <q-avatar size="32px" color="orange" class="q-mr-md">
                    {{ props.provider?.trading_name?.charAt(0).toUpperCase() }}
                </q-avatar>

                <div class="column">
                    <div>{{ props.provider?.trading_name }}</div>
                    <div class="column">
                        <div class="row items-center text-blue-grey-4">
                            <q-icon :name="ionLocation" class="q-mr-sm" />
                            {{ props.provider?.address }}
                        </div>
                        <div class="row items-center text-blue-grey-4 q-ml-lg">
                            {{ props.provider?.city }}, {{ props.provider?.province }}
                        </div>
                        <div class="row items-center text-blue-grey-4">
                            <q-icon :name="ionCall" class="q-mr-sm" />
                            {{ props.provider?.phone_number }}
                        </div>
                    </div>
                </div>
                <q-space />
                <div class="row items-end">
                    <q-btn unelevated color="secondary" :icon="ionChatbubbleEllipses" label="Chat" text-color="accent"
                        @click="$emit('goToChat')" no-caps />
                </div>
            </div>
        </q-card-section>

        <q-card-section v-else>
            <div class="text-body1 text-bold q-mb-sm">Provider</div>
            <div class="row">
                <q-skeleton type="QAvatar" size="32px" class="q-mr-md" />

                <div class="column">
                    <q-skeleton type="text" />
                    <div class="column">
                        <q-skeleton type="text" width="200px" />
                        <q-skeleton type="text" class="q-ml-lg" />
                        <q-skeleton type="text" />
                    </div>
                </div>
                <q-space />
                <div class="row items-end">
                    <q-skeleton type="QBtn" />
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import type { Provider } from '@/interfaces/rest/Provider';
import { ionChatbubbleEllipses, ionLocation, ionCall } from '@quasar/extras/ionicons-v6';

const props = defineProps<{
    provider: Provider | undefined;
}>();

const emit = defineEmits<{
    goToChat: [];
}>();
</script>