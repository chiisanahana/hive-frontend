import http from '@/http-common';

class CarService {
  get(id: number): Promise<any> {
    return http.get(`/cars/${id}/`);
  }

  getAll(): Promise<any> {
    return http.get("/cars/");
  }

  delete(id: number): Promise<any> {
    return http.delete(`/cars/${id}/`);
  }
}

export default new CarService();
