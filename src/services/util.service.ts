import http from '@/http-common';

class UtilService {
    getLocationList(): Promise<any> {
        return http.get('/');
    }
}

export default new UtilService();