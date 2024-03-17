import http from '@/http-common';

class WishlistService {
  get(id: number): Promise<any> {
    return http.get(`/wishlists/${id}/`);
  }

  getAll(): Promise<any> {
    return http.get("/wishlists/");
  }

  delete(id: number): Promise<any> {
    return http.delete(`/wishlists/${id}/`);
  }
}

export default new WishlistService();
