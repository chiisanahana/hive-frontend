import type { Car } from '@/interfaces/rest/Car';
import type { Customer } from '@/interfaces/rest/Customer';
import type { Payment } from './Payment';

export interface Order {
    id?: number;
    car?: Car;
    car_id?: number;
    customer?: Customer;
    customer_id?: number;
    start_datetime: string;
    end_datetime: string;
    pickup_location: string;
    return_location: string;
    status: string;
    base_fee: string;
    transport_fee?: string;
    damage_fee?: string;
    late_fee?: string;
    review?: string;
    rating?: number;
    created_datetime?: string;
    updated_datetime?: string;
    payments: Payment[] | [];
}