<template>
    <q-menu transition-show="jump-down" transition-hide="jump-up" anchor="bottom middle" self="top middle"
        @before-show="getChatRooms()">
        <q-list style="width: 350px">
            <q-item-label header class="q-py-sm">
                <div class="q-my-xs text-bold">Chat</div>
            </q-item-label>
            <q-scroll-area :style="{ height: height }">
                <q-resize-observer @resize="onResize"></q-resize-observer>
                <ChatDropdownSkeleton v-if="isLoading" />

                <q-item clickable v-close-popup v-ripple v-else-if="rooms.length > 0" v-for="room in rooms"
                    @click="goToChat(room)">
                    <q-item-section avatar>
                        <q-avatar v-if="room.provider?.profile_picture != null">
                            <img :src="getProfPict(room.provider)">
                        </q-avatar>
                        <q-avatar v-else color="orange" class="text-white">
                            {{ room.provider!.trading_name?.charAt(0).toUpperCase() }}
                        </q-avatar>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label lines="1" class="text-weight-bold">
                            {{ room.provider?.trading_name }}
                        </q-item-label>
                        <q-item-label caption lines="2">
                            {{ getLastMessage(room) }}
                        </q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                        {{ formatChatTime(getLastSentTime(room)) }}
                    </q-item-section>
                </q-item>

                <!-- if doesn't have chat yet -->
                <q-item v-else v-show="!isLoading">
                    <q-item-section align="center">Your chat is empty</q-item-section>
                </q-item>
            </q-scroll-area>
        </q-list>
    </q-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import ChatService from '@/services/chat.service';
import ChatDropdownSkeleton from '@/components/skeleton/ChatDropdownSkeleton.vue';
import { useChatStore } from '@/stores/chat';
import { getProfPict } from '@/composables/getter';
import { formatChatTime } from '@/composables/formatter';

const props = defineProps<{
    customerId: number;
}>();

const router = useRouter();
const chatStore = useChatStore();
const rooms = ref<ChatRoom[]>([]);
const height = ref<string>('48px');
const isLoading = ref<boolean>(false);

// computable height and max height of dropdown
const onResize: any = (size: any) => {
    height.value = size.height <= 300 ? `${size.height}px` : '300px';
}

function goToChat(room: ChatRoom) {
    chatStore.setCurrentRoom(room);
    router.push({ name: 'chat' });
}

function getChatRooms() {
    isLoading.value = true;
    ChatService.getRoomByCustomer(props.customerId).then((response) => {
        rooms.value = response.data.filter((room: any) => {
            return room.chats.length > 0;
        });
        isLoading.value = false;
    });
}

function getLastMessage(room: ChatRoom) {
    const lastChat = room.chats.slice(-1);
    return lastChat.length > 0 ? lastChat[0].message : 'Draft';
}

function getLastSentTime(room: ChatRoom) {
    const lastChat = room.chats.slice(-1);
    return lastChat.length > 0 ? lastChat[0].created_datetime : undefined;
}

</script>