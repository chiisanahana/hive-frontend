import type { UserType } from '@/enums/enum';
import http from '@/http-common';
import type { Chat } from '@/interfaces/rest/Chat';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';

class ChatService {
    getRoom(id: number): Promise<any> {
        return http.get(`/chat-rooms/${id}`);
    }

    getRoomByCustomer(customerId: number): Promise<any> {
        return http.get('/chat-rooms/', {
            params: { customer_id: customerId }
        })
    }

    getRoomByProvider(providerId: number): Promise<any> {
        return http.get('/chat-rooms/', {
            params: { provider_id: providerId }
        })
    }

    createOrGetRoom(customerId: number, providerId: number): Promise<any> {
        // create room or get if exists, handled by BE
        return http.get('/chat-rooms/create-get', {
            params: {
                customer_id: customerId,
                provider_id: providerId
            }
        });
    }

    // getChatsByRoom(roomId: number) {
    //     return http.get('/chats/', {
    //         params: { chat_room_id: roomId }
    //     })
    // }

    sendChat(chat: Chat): Promise<any> {
        return http.post('/chats/', chat);
    }

    readChat(chatRoom: ChatRoom, type: UserType): Promise<any> {
        return http.post(`/chats/read/${type}/${chatRoom.id}`);
    }
}

export default new ChatService();