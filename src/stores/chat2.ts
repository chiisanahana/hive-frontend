import { defineStore } from 'pinia';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import type { Chat } from '@/interfaces/rest/Chat';

export const useChatStore = defineStore('chat', {
    state: () => ({
        room: null as ChatRoom | null,
        chats: null as Chat[] | null,
        ws: null as WebSocket | null,
    }),
    getters: {
        getCurrentRoom: (state) => state.room,
        getChats: (state) => state.chats,
    },
    actions: {
        setCurrentRoom(chatRoom: ChatRoom) {
            if (this.ws) {
                this.ws.close();
                console.log('WebSocket connection closed');
            }

            this.room = chatRoom;
            this.chats = this.room.chats;

            this.ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/chat/${this.room?.provider?.id}_${this.room?.customer?.id}/`);
            this.ws.onopen = () => console.log('WebSocket connection established');
            this.ws.onmessage = event => {
                try {
                    // Attempt to parse incoming message
                    const message = JSON.parse(event.data);
                    console.log(message);
                    // Update application state reactively with the new data
                } catch (parseError) {
                    // Log error if message parsing fails
                    console.error('Error parsing WebSocket message:', parseError);
                }
                // console.log(this.room);
            }
        }
    }
});
