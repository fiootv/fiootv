export interface Customer {
  id: string;
  platform_id: string;
  
  // Customer Information
  customer_from?: string;
  subscription_status: string;
  full_name: string;
  phone?: string;
  email: string;
  billing_address?: string;
  shipping_address?: string;
  currency?: string;
  
  // Subscription Information
  subscription_id: string;
  plan_id: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  next_renewal?: string;
  price?: number;
  
  // Payment Information
  payment_method?: string;
  payment_status?: string;
  payment_gateway?: string;
  card_details?: string;
  reference_number?: string;
  
  // Trial Information
  has_trial: boolean;
  trial_start_date?: string;
  trial_end_date?: string;
  total_hours?: number;
  
  // Device Information
  device_type?: string[];
  mac_address?: string;
  service_type?: string;
  any_other_device?: string;
  
  // File Attachment
  attachment_file_url?: string;
  attachment_file_name?: string;
  
  // Metadata
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  // Customer Information
  customer_from?: string;
  subscription_status: string;
  full_name: string;
  phone?: string;
  email: string;
  billing_address?: string;
  shipping_address?: string;
  currency?: string;
  
  // Subscription Information
  subscription_id: string;
  plan_id: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  price?: number;
  
  // Payment Information
  payment_method?: string;
  payment_status?: string;
  payment_gateway?: string;
  card_details?: string;
  reference_number?: string;
  
  // Trial Information
  has_trial: boolean;
  trial_start_date?: string;
  trial_end_date?: string;
  total_hours?: number;
  
  // Device Information
  device_type?: string[];
  mac_address?: string;
  service_type?: string;
  any_other_device?: string;
  
  // File Attachment
  attachment_file?: File;
}

export const DEVICE_TYPES = [
  'MAG Device',
  'Android Box',
  'Fire Stick',
  'Apple iPhone',
  'Smart TV',
  'PC / LAPTOP',
  'Android Phone',
  'Any Other Device'
] as const;

export const PLAN_OPTIONS = [
  '1 Month Service',
  '3 Month Service',
  '6 Month Service',
  '1 Year Service',
  '1 Yr20disc',
  '1 Day Trial Service',
  '1 Day Trial',
  'Premium Month',
  'Premium 6 Month',
  'Premium 1 Year',
  '1 Month Plan',
  '6 Months Plan',
  '1 Year Plan'
] as const;

export const SUBSCRIPTION_STATUSES = [
  'active',
  'inactive',
  'pending',
  'cancelled',
  'in_trial',
  'expired'
] as const;

export const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD'
] as const;

export const PAYMENT_STATUSES = [
  'paid',
  'pending',
  'failed',
  'refunded',
  'cancelled'
] as const;

export interface CardDetails {
  number: string;
}
