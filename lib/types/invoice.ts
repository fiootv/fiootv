export interface Invoice {
  id: string;
  platform_id: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  description?: string;
  payment_method?: string;
  paid_date?: string;
  payment_notes?: string;
  document_urls?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithRelations extends Invoice {
  platforms: Platform;
  customers: Customer;
}

export interface InvoiceFormData {
  platform_id: string;
  customer_id: string;
  invoice_number?: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  description?: string;
  payment_method?: string;
  paid_date?: string;
  payment_notes?: string;
  document_urls?: string[];
}

export interface Platform {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
}

export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'BRL'
] as const;

export const PAYMENT_METHODS = [
  'Credit Card',
  'Bank Transfer',
  'PayPal',
  'Stripe',
  'Cash',
  'Check',
  'Wire Transfer',
  'Other'
] as const;
