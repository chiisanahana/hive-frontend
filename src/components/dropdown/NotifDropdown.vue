<template>
    <q-menu transition-show="jump-down" transition-hide="jump-up" anchor="bottom middle" self="top middle"
        @before-show="getNotif()">
        <q-list style="width: 350px">
            <q-item-label header class="q-py-sm">
                <div class="q-my-xs text-bold">Notification</div>
            </q-item-label>
            <q-scroll-area :style="{ height: height }">
                <q-resize-observer @resize="onResize"></q-resize-observer>
                <q-item v-if="notifications.length > 0" v-for="notif in notifications"
                    :class="notif.isread == '0' ? 'bg-secondary' : ''" clickable @click="markAsRead(notif)">
                    <q-item-section>
                        <q-item-label caption>{{ formatChatTime(notif.created_datetime) }}</q-item-label>
                        <q-item-label>{{ notif.title }}</q-item-label>
                        <q-item-label caption>{{ notif.message }}</q-item-label>
                        
                    </q-item-section>
                </q-item>
                <q-item v-else>
                    <q-item-section align="center">No notification</q-item-section>
                </q-item>
            </q-scroll-area>
        </q-list>
    </q-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserType } from '@/enums/enum';
import type { Notification } from '@/interfaces/rest/Notification';
import NotificationService from '@/services/notification.service';
import { formatChatTime } from '@/composables/formatter';

const props = defineProps<{
    userId: number;
    type: UserType;
}>();

const notifications = ref<Notification[]>([]);
const height = ref<string>('48px');
const isLoading = ref<boolean>(false);

// computable height and max height of dropdown
const onResize: any = (size: any) => {
    height.value = size.height <= 300 ? `${size.height}px` : '300px';
}

function getNotif() {
    NotificationService.get(props.userId, props.type).then((response) => {
        notifications.value = response.data;
    })
}

function markAsRead(notif: Notification) {
    NotificationService.readNotif(notif.id).then((response) => {
        notifications.value.map((data: Notification) => {
            if (data.id == notif.id) data.isread = '1';
        })
    })
}

</script>