import type { Car } from "./Car";

export interface Wishlist {
    id?: number;
    car?: Car;
    car_id?: number;
    customer_id: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
}