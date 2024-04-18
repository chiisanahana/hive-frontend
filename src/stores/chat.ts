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
            // order chat
            this.chats.sort((chat1: any, chat2: any) => {
                const time1 = chat1.created_datetime;
                const time2 = chat2.created_datetime;
                if (time1 != undefined && time2 != undefined) {
                    return time2.localeCompare(time1);
                }
                return 0;
            });
        },
        addChat(chat: Chat) {
            this.chats?.unshift(chat);
        },
    },
});
