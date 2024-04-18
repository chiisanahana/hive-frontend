import { defineStore } from 'pinia';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import type { Chat } from '@/interfaces/rest/Chat';
import { UserType } from '@/enums/enum';

export const useChatStore = defineStore('chat', {
    state: () => ({
        room: null as ChatRoom | null,
        chats: null as Chat[] | null
    }),
    getters: {
        getCurrentRoom: (state) => state.room,
        getChats(): any {
            return this.chats;
        },
    },
    actions: {
        setCurrentRoom(chatRoom: ChatRoom) {
            this.room = chatRoom;
            this.chats = chatRoom.chats;
        },
        addChat(chat: Chat) {
            this.chats?.push(chat);
        },
    },
});
