import { UserType } from '@/enums/enum';
import http from '@/http-common';

class NotificationService {
    get(userId: number, type: UserType): Promise<any> {
        let params: any;
        if (type == UserType.C) {
            params = { customer_id: userId }
        } else {
            params = { provider_id: userId }
        }
        return http.get('/notifications/', { params: params })
    }

    createNotif(userId: number, type: UserType, title: string, message: string): Promise<any> {
        let data: any;
        if (type == UserType.C) {
            data = {
                customer_id: userId,
                title: title,
                message: message
            }
        } else {
            data = {
                provider_id: userId,
                title: title,
                message: message
            }
        }
        return http.post('/notifications/', data);
    }

    readNotif(id: number): Promise<any> {
        return http.put(`/notifications/${id}/`, { isread: '1' })
    }
}

export default new NotificationService();