import http from '@/http-common';
import type { RentDetails } from '@/interfaces/RentDetails';
import { formatTimestampBackend } from '@/composables/formatter';
import type { Car } from '@/interfaces/rest/Car';

class CarService {
  get(id: number): Promise<any> {
    return http.get(`/cars/${id}/`);
  }

  getAll(): Promise<any> {
    return http.get('/cars/');
  }

  getByProviderId(providerId: number): Promise<any> {
    return http.get('/cars/', {
      params: { provider_id: providerId }
    });
  }

  searchCar(rentDetails: RentDetails): Promise<any> {
    return http.post('/customer/check-schedule', {
      start_date: formatTimestampBackend(rentDetails.startDate, '00:00:00'),
      end_date: formatTimestampBackend(rentDetails.endDate, '23:59:59'),
      province: rentDetails.province,
      city: rentDetails.city
    });
  }

  addCar(car: Car): Promise<any> {
    return http.post('/cars/', car);
  }

  updateCar(car: Car): Promise<any> {
    return http.put(`/cars/${car.id}/`, car);
  }

  updateCarStatus(id: number, status: string): Promise<any> {
    return http.put(`/cars/${id}/`, { status: status });
  }
  
  // soft delete
  deleteCar(id: number): Promise<any> {
    return http.put(`/cars/${id}/`, { isdelete: "1" });
  }
}

export default new CarService();
