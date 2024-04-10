import http from '@/http-common';

class BalanceService {
    getHistory(providerId: number): Promise<any> {
        return http.get('/balance-histories/', {
            params: { provider_id: providerId }
        });
    }

    withdraw(providerId: number, amount: number): Promise<any> {
        return http.post('/withdraw', {
            provider_id: providerId,
            amount: amount
        });
    }
}

export default new BalanceService();