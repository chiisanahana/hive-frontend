import http from "@/http-common";

class CarService {
  get(id: number | string): Promise<any> {
    return http.get(`/cars/${id}/`);
  }

  getAll(): Promise<any> {
    return http.get("/cars/");
  }

  delete(id: number | string): Promise<any> {
    return http.post("/cars/delete", { id: id });
  }
}

export default new CarService();
