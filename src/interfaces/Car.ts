export interface Car {
  id: number | string;
  provider_id: number | string;
  brand: string;
  year: number | string;
  color: string;
  seat: number | string;
  vehicle_no: string;
  transmission: string;
  price: number | string;
  deposit?: number | string;
  description?: string;
  status: string;
  created_datetime: string;
  updated_datetime?: string;
  updated_by?: number | string;
}
