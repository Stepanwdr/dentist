// src/shared/api/types.ts

export type ApiStatus = 'ok' | 'error' | 'success' | 'fail';
export type userRole = 'admin' | 'administrator' | 'director' | 'dentist' | 'patient' | string;
export interface ApiResponse<T = any> {
  status: ApiStatus;
  message?: string;
  errors?: any;
  data?: T;
}

// ===== Auth types =====
export interface AuthUser {
  id: number;
  name?: string;
  lname?: string;
  fname?: string;
  email: string;
  clinicId?: number
  phone?: string;
  role?: 'admin' | 'administrator' | 'director' | 'dentist' | 'patient' | string;
  dentistId?:number
  birthDate: string;
  allergies: string;
  unreadNotifications: number;
  avatar: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  lname?: string;
  fname?: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string; // ISO or YYYY-MM-DD
  gender?: 'male' | 'female';
  // Role of the user being registered: 'patient' or 'doctor' (dentist)
  role?: userRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string
  user: AuthUser;
}

// ===== Time slots =====
export interface TimeSlotDTO {
  id: number;
  dentistId: number;
  clinicId?: number | null;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  notes?: string | null;
}

export interface ListTimeSlotsParams {
  dentistId?: number | string;
  clinicId?: number | string;
  date?: string; // YYYY-MM-DD
  from?: string; // HH:mm or HH:mm:ss
  to?: string;   // HH:mm or HH:mm:ss
}

export interface CreateTimeSlotBody {
  dentistId: number | string;
  clinicId?: number | string | null;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string | null;
}

export interface CreateBatchBody {
  dentistId: number | string;
  clinicId?: number | string | null;
  date: string;
  startTime: string;
  endTime: string;
  stepMin?: number; // default 30
  notes?: string | null;
}

export interface UpdateTimeSlotBody {
  date?: string;
  startTime?: string;
  endTime?: string;
  notes?: string | null;
}
