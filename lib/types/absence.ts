export interface Absence {
  id: string;
  description: string;
  date: string;
  email: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AbsenceFormData {
  description: string;
  date: string;
  email: string;
}
