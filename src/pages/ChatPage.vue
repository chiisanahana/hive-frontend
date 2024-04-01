<template>
    <div class="row">
        <div class="col-3">
            <!-- list of chat rooms -->
            <q-list bordered class="bg-white" style="max-width: 350px;">
                <q-item-label header>Chats</q-item-label>

                <q-scroll-area style="height: calc(100vh - 70px - 50px);">
                    <div v-for="room in chatRooms">
                        <q-item clickable v-ripple @click="chatStore.setCurrentRoom(room)"
                            :active="chatStore.getCurrentRoom != null && room.id == chatStore.getCurrentRoom.id"
                            active-class="bg-secondary">
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

                        <q-separator inset="item" />
                    </div>
                </q-scroll-area>
            </q-list>
        </div>
        <div class="column justify-between col-9">
            <ChatRoomView v-if="chatStore.room != undefined" :room="chatStore.room" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { QSpinnerGears, useQuasar } from 'quasar';
import { useChatStore } from '@/stores/chat';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import ChatService from '@/services/chat.service';
import UserService from '@/services/user.service';
import { getProfPict } from '@/composables/getter';
import ChatRoomView from '@/components/ui-block/ChatRoomView.vue';
import { formatChatTime } from '@/composables/formatter';

const quasar = useQuasar();
const chatStore = useChatStore();
const chatRooms = ref<ChatRoom[]>([]);

function getChatRooms() {
    quasar.loading.show({ spinner: QSpinnerGears });
    ChatService.getRoomByCustomer(UserService.getLoggedInCust().id)
        .then((response) => {
            // console.log(response.data);
            chatRooms.value = response.data;
            // order chatroom by last message
            chatRooms.value.sort((chat1: any, chat2: any) => {
                const time1 = getLastSentTime(chat1);
                const time2 = getLastSentTime(chat2);
                if (time1 != undefined && time2 != undefined) {
                    return time2.localeCompare(time1);
                }
                return 0;
            })
            quasar.loading.hide();
        })
        .catch((error) => {
            console.log(error);
            quasar.loading.hide();
        })
}

function getLastMessage(room: ChatRoom) {
    const lastChat = room.chats.slice(-1);
    return lastChat.length > 0 ? lastChat[0].message : 'Draft';
}

function getLastSentTime(room: ChatRoom) {
    const lastChat = room.chats.slice(-1);
    return lastChat.length > 0 ? lastChat[0].created_datetime : undefined;
}

onBeforeMount(() => {
    getChatRooms();
})

</script>