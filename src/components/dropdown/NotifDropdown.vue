<template>
    <q-menu transition-show="jump-down" transition-hide="jump-up" anchor="bottom middle" self="top middle">
        <q-list style="width: 350px">
            <q-item-label header class="q-py-sm">
                <div class="q-my-xs text-bold">Notification</div>
            </q-item-label>
            <q-scroll-area :style="{ height: height }">
                <q-resize-observer @resize="onResize"></q-resize-observer>
                <NotifDropdownSkeleton v-if="notifStore.getNotif == null" />
                <q-item v-else-if="notifStore.getCount > 0" v-for="notif in notifStore.getNotif"
                    :class="notif.isread == '0' ? 'bg-secondary' : ''" :clickable="notif.isread == '0'"
                    @click="markAsRead(notif)">
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
import NotifDropdownSkeleton from '@/components/skeleton/NotifDropdownSkeleton.vue';
import { useNotifStore } from '@/stores/notif';

const notifStore = useNotifStore();
const height = ref<string>('48px');
const isLoading = ref<boolean>(false);

// computable height and max height of dropdown
const onResize: any = (size: any) => {
    height.value = size.height <= 300 ? `${size.height}px` : '300px';
}

function markAsRead(notif: Notification) {
    NotificationService.readNotif(notif.id).then((response) => {
        notifStore.setRead(notif.id);
    })
}

</script>