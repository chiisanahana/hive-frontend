export interface Payment {
    id?: number;
    order_id: number;
    invoice_no: string;
    payment_method: string;
    amount: string | number;
    deposit: string | number;
    transaction_datetime?: string;
    deposit_return_time?: string;
    refund_datetime?: string;
    status: string;
}