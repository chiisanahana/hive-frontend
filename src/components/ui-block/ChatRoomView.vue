<template>
    <div class="q-pa-md row justify-center">
        <q-scroll-area style="width:100%; height: calc(100vh - 72px - 72px - 32px);"    >
            <div v-if="room != null" v-for="(chat, index) in chatStore.getChats">
                <div class="row justify-center">
                    <q-chip
                        v-if="index == 0 ||
                            formatTimestampToDateDisplay(chat.created_datetime) != formatTimestampToDateDisplay(chatStore.getChats[index - 1].created_datetime)"
                        square color="secondary" text-color="accent" class="self-center">
                        {{ getChatDate(chat) }}
                    </q-chip>
                </div>
                <q-chat-message v-if="isSentByMe(chat)" bg-color="indigo-1" text-color="font" :text="[chat.message]"
                    :stamp="formatTimestampToTime(chat.created_datetime)" sent class="q-mr-xl" />
                <q-chat-message v-else bg-color="accent" text-color="white" :text="[chat.message]"
                    :stamp="formatTimestampToTime(chat.created_datetime)" class="q-ml-md" />
            </div>
        </q-scroll-area>
    </div>
    <div class="q-pa-md">
        <!-- {{ testing }} -->
        <form @submit="sendChat">
            <q-input dense filled v-model="text">
                <template v-slot:after>
                    <q-btn round flat type="submit" color="accent" icon="send" @click="sendChat" />
                </template>
            </q-input>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { date } from 'quasar';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import type { Chat } from '@/interfaces/rest/Chat';
import ChatService from '@/services/chat.service';
import { formatTimestampToDate, formatTimestampToDateDisplay, formatTimestampToTime } from '@/composables/formatter';
import { UserType } from '@/enums/enum';
import { useChatStore } from '@/stores/chat';

const props = defineProps<{
    room: ChatRoom | null,
    userType: UserType
}>();

// watch(props, async () => {
//     console.log(props.room);
//     connection.value = new WebSocket(`${import.meta.env.VITE_WS_URL}/chat/${props.room?.provider?.id}_${props.room?.customer?.id}/`);

//     connection.value.onopen = () => console.log('connection open');
//     connection.value.onmessage = (e) => {
//         console.log('print something plis')
//         console.log(e.data);
//         testing.value.push(e.data);
//     }
// })
const chatStore = useChatStore();
const text = ref<string>('');
// const connection = ref<WebSocket>(new WebSocket(`${import.meta.env.VITE_WS_URL}/chat/${props.room?.provider?.id}_${props.room?.customer?.id}/`));
// const testing = ref<string[]>([]);

// connection.value.onopen = () => console.log('connection open');
// connection.value.onmessage = (e) => {
//     console.log('print something plis')
//     console.log(e.data);
//     testing.value.push(e.data);
// }

function isSentByMe(chat: Chat) {
    if (props.userType == UserType.C) {
        return chat.customer_id != null;
    } else {
        return chat.provider_id != null;
    }
}

function getChatDate(chat: Chat) {
    const now = formatTimestampToDate(new Date().toISOString());
    if (formatTimestampToDate(chat.created_datetime) == now) return 'Today';

    const yesterday = formatTimestampToDate(date.subtractFromDate(new Date(), { days: 1 }).toISOString())
    if (formatTimestampToDate(chat.created_datetime) == yesterday) return 'Yesterday';

    return formatTimestampToDateDisplay(chat.created_datetime);
}

function sendChat() {
    const msg = text.value;
    text.value = '';

    chatStore.addChat({
        chat_room_id: props.room?.id,
        customer_id: props.room?.customer?.id,
        message: msg,
        is_read: false,
        created_datetime: new Date().toLocaleString('sv').replace(' ', 'T')
    } as Chat);

    ChatService.sendChat({
        chat_room_id: props.room?.id,
        message: msg,
        customer_id: props.room?.customer?.id
    } as Chat);
}

// onBeforeMount(() => {
//     if (props.room != undefined) {
//         chats.value = props.room.chats;
//     }
// });
</script>