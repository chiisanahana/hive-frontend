import type { Customer } from '@/interfaces/rest/Customer';
import type { Provider } from '@/interfaces/rest/Provider';
import type { Chat } from './Chat';

export interface ChatRoom {
    id?: number;
    provider?: Provider;
    provider_id?: number;
    customer?: Customer;
    customer_id?: number;
    chats: Chat[] | []
}