import type { CarFile } from "./CarFile";
import type { Provider } from "./Provider";

export interface Car {
  id: number;
  provider_id?: number;
  provider?: Provider;
  brand: string;
  car_type: string;
  year: number;
  color: string;
  seat: number;
  vehicle_no: string;
  transmission: string;
  fuel: string;
  price: number;
  deposit: number;
  description: string;
  status: string;
  rating: number;
  click_count: number;
  order_count: number;
  created_datetime: string;
  updated_datetime?: string;
  updated_by?: number;
  isdelete: string;
  car_files: CarFile[] | [];
}
