export interface BalanceHistory {
    id?: number,
    provider_id: number,
    amount: number,
    transaction_datetime?: string
    is_income: boolean
}