export interface Reseller {
  id: string;
  platform_id: string;
  reseller_for: string;
  full_name: string;
  email: string;
  phone?: string;
  street_address?: string;
  city?: string;
  country?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ResellerFormData {
  platform_id: string;
  reseller_for: string;
  full_name: string;
  email: string;
  phone?: string;
  street_address?: string;
  city?: string;
  country?: string;
}

export interface Platform {
  id: string;
  name: string;
}
