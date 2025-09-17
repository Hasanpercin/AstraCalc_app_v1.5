// User Profile Types for Robust Registration System

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  birth_date?: string; // DD-MM-YYYY format
  birth_time?: string;
  birth_place?: string;
  email_verified: boolean;
  profile_completed: boolean;
  status: 'active' | 'inactive' | 'suspended';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_seen_at?: string;
}

export interface UserRegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
}

export interface RegistrationResponse {
  success: boolean;
  profile_id?: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  is_duplicate_name?: boolean;
  error?: RegistrationError;
  message: string;
}

export type RegistrationError = 
  | 'EMAIL_EXISTS'
  | 'USER_ID_EXISTS'
  | 'INVALID_EMAIL'
  | 'INVALID_NAME'
  | 'CONSTRAINT_VIOLATION'
  | 'UNKNOWN_ERROR';

export interface UserDisplayInfo {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  display_name: string; // Enhanced name for disambiguation
  created_at: string;
}

export interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  birth_time?: string;
  birth_place?: string;
}

export interface DuplicateNameContext {
  has_duplicates: boolean;
  total_count: number;
  disambiguation_method: 'email_prefix' | 'registration_date' | 'user_id';
}