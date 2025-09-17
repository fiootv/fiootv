export interface Note {
  id: string;
  title: string;
  description: string;
  platform_id?: string;
  customer_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NoteFormData {
  title: string;
  description: string;
  platform_id?: string;
  customer_id?: string;
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
