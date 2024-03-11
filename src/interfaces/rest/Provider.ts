export interface Provider {
    id: number;
    name?: string;
    trading_name?: string;
    email: string;
    address?: string;
    city?: string;
    province?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    id_card?: string;
    phone_number?: string;
    status: string;
    balance: number;
    created_datetime: string;
    approved_datetime?: string;
    updated_datetime?: string;
    approved_by?: number;
}