import http from '@/http-common';
import { formatTimestampBackend } from '@/composables/formatter';
import type { RentDetails } from '@/interfaces/RentDetails';

class OrderService {
    get(id: number): Promise<any> {
        return http.get(`/orders/${id}/`);
    }

    getAll(): Promise<any> {
        return http.get('/orders/');
    }

    getByCustomerId(customerId: number): Promise<any> {
        return http.get('/orders/', {
            params: { customer_id: customerId }
        });
    }

    getByProviderId(providerId: number): Promise<any> {
        return http.get('/orders/', {
            params: { provider_id: providerId }
        });
    }

    createOrder(carId: number, customerId: number, rentDetails: RentDetails): Promise<any> {
        return http.post('/orders/', {
            car_id: carId,
            customer_id: customerId,
            start_datetime: formatTimestampBackend(rentDetails.startDate, rentDetails.startTime),
            end_datetime: formatTimestampBackend(rentDetails.startDate, rentDetails.endTime),
            pickup_location: rentDetails.pickupAddress,
            return_location: rentDetails.returnAddress,
            status: 0
        });
    }

    rateOrder(orderId: number, rate: number): Promise<any> {
        return http.post('/orders/rate', { id: orderId, rating: rate });
    }
}

export default new OrderService();
