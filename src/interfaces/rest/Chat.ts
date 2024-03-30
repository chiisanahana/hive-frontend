export interface Chat {
    id: number;
    chat_room_id?: number;
    customer_id?: number;
    provider_id?: number;
    message: string;
    is_read: boolean;
    created_datetime?: string;
}