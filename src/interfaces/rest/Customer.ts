export interface Customer {
  id: number;
  email: string;
  name?: string;
  id_card?: string;
  license_card?: string;
  phone_number?: string;
  status?: string;
  profile_picture?: string;
  created_datetime: string;
  updated_datetime?: string;
  approved_datetime?: string;
  approved_by?: number;
  is_provider?: boolean;
}