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

    createOrder(carId: number, customerId: number, basePrice: number, rentDetails: RentDetails): Promise<any> {
        return http.post('/orders/', {
            car_id: carId,
            customer_id: customerId,
            start_datetime: formatTimestampBackend(rentDetails.startDate, rentDetails.startTime),
            end_datetime: formatTimestampBackend(rentDetails.endDate, rentDetails.endTime),
            pickup_location: rentDetails.pickupAddress,
            return_location: rentDetails.returnAddress,
            base_price: basePrice,
            status: 0
        });
    }

    updateOrderStatus(id: number, status: string): Promise<any> {
        return http.put(`/orders/${id}/`, { status: status });
    }

    completeOrder(orderId: number, providerId: number): Promise<any> {
        return http.post(`/orders/complete/${orderId}`, { provider_id: providerId });
    }
    
    cancelOrder(orderId: number): Promise<any> {
        return http.post(`/orders/cancel/${orderId}`);
    }

    rateOrder(id: number, rate: number): Promise<any> {
        return http.post('/orders/rate', { id: id, rating: rate });
    }
}

export default new OrderService();
