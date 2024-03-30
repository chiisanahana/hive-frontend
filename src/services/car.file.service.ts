
import http from '@/http-common';
import type { CarFile } from '@/interfaces/rest/CarFile';

class CarFileService {
    getByCarId(carId: number): Promise<any> {
        return http.get('/car-files/', {
            params: { provider_id: carId }
        });
    }

    addCarPhoto(photo: CarFile): Promise<any> {
        return http.post('/car-files/', photo);
    }
}

export default new CarFileService();
