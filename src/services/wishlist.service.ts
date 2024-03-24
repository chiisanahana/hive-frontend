import http from '@/http-common';
import { formatDateBackend } from '@/composables/formatter';
import type { RentDetails } from '@/interfaces/RentDetails';

class WishlistService {
  get(id: number): Promise<any> {
    return http.get(`/wishlists/${id}/`);
  }

  getAll(): Promise<any> {
    return http.get('/wishlists/');
  }

  getByCustomerId(customerId: number): Promise<any> {
    return http.get('/wishlists/', {
      params: { customer_id: customerId }
    });
  }

  addWishlist(carId: number, customerId: number, rentDetails: RentDetails): Promise<any> {
    return http.post('/wishlists/', {
      car_id: carId,
      customer_id: customerId,
      start_date: formatDateBackend(rentDetails.startDate),
      end_date: formatDateBackend(rentDetails.endDate),
      start_time: rentDetails.startTime,
      end_time: rentDetails.endTime
    });
  }

  delete(id: number): Promise<any> {
    return http.delete(`/wishlists/${id}/`);
  }
}

export default new WishlistService();
