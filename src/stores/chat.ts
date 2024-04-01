import { defineStore } from 'pinia';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import type { Chat } from '@/interfaces/rest/Chat';

export const useChatStore = defineStore('chat', {
    state: () => ({
        room: null as ChatRoom | null,
    }),
    getters: {
        getCurrentRoom: (state) => state.room,
    },
    actions: {
        setCurrentRoom(chatRoom: ChatRoom) {
            this.room = chatRoom;
            // console.log(this.room);
        }
    },
});
