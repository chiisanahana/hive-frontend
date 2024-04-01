import http from '@/http-common';

class UtilService {
    getLocationList(): Promise<any> {
        return http.get('/customer/dropdown-location');
    }

    generateInvoice(): string {
        return (Math.random().toString(36).slice(2)).toUpperCase();
    }
}

export default new UtilService();