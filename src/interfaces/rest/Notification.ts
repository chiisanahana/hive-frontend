export interface Notification {
    id: number;
    isread: string;
    title: string;
    message: string;
    created_datetime: string;
    provider_id?: number;
    customer_id?: number;
}