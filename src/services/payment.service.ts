import http from '@/http-common';
import UtilService from '@/services/util.service';

class PaymentService {
    get(id: number): Promise<any> {
        return http.get(`/payments/${id}/`);
    }

    getAll(): Promise<any> {
        return http.get('/payments/');
    }

    getByProviderId(providerId: number): Promise<any> {
        return http.get('/payments/', {
            params: { provider_id: providerId }
        });
    }

    initiatePayment(orderId: number, amount: number): Promise<any> {
        return http.post('/payment/initiate', {
            order_id: orderId,
            // invoice_no: UtilService.generateInvoice(),
            // payment_method: paymentMethod,
            amount: amount
        });
    }

    completePayment(paymentId: number): Promise<any> {
        return http.put(`/payments/${paymentId}/`, {
            status: 'PA'
        })
    }
}

export default new PaymentService();
