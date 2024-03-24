import http from '@/http-common';

class UtilService {
    getLocationList(): Promise<any> {
        return http.get('/customer/dropdown-location');
    }

    generateInvoice(): string {
        // TODO: add logic
        return 'INVOICE001';
    }
}

export default new UtilService();