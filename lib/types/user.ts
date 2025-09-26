export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  auth_user_id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_login?: string;
}

export interface CreateUserData {
  email: string;
  full_name?: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserData {
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UserWithCreator extends User {
  creator?: {
    id: string;
    full_name?: string;
    email: string;
  };
}
