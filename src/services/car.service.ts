import http from '@/http-common';
import type { RentDetails } from '@/interfaces/RentDetails';
import type { CarFilter } from '@/interfaces/CarFilter';
import { formatTimestampBackend } from '@/composables/formatter';

class CarService {
  get(id: number): Promise<any> {
    return http.get(`/cars/${id}/`);
  }

  getAll(): Promise<any> {
    return http.get('/cars/');
  }

  searchCar(rentDetails: RentDetails, filter?: CarFilter): Promise<any> {
    const location: string[] = rentDetails.location.split(', ');

    return http.post('/customer/check-schedule', {
      start_date: formatTimestampBackend(rentDetails.startDate, '00:00:00'),
      end_date: formatTimestampBackend(rentDetails.endDate, '23:59:59'),
      province: location[1],
      city: location[0]
      // start_price: null,
      // end_price: null,
      // car_type: null,
      // start_year: null,
      // end_year: null,
      // seat: null,
      // transmission: null,
      // fuel: null
    });
  }

  delete(id: number): Promise<any> {
    return http.delete(`/cars/${id}/`);
  }
}

export default new CarService();
