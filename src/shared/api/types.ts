// src/shared/api/types.ts

export type ApiStatus = 'ok' | 'error' | 'success' | 'fail';

export interface ApiResponse<T = any> {
  status: ApiStatus;
  message?: string;
  errors?: any;
  [key: string]: any; // allow backend-specific payloads like { slots: TimeSlot[] }
}

// ===== Auth types =====
export interface AuthUser {
  id: number | string;
  name?: string;
  lname?: string;
  fname?: string;
  email: string;
  role?: 'admin' | 'administrator' | 'director' | 'doctor' | 'patient' | string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  lname: string;
  fname: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string; // ISO or YYYY-MM-DD
  gender?: 'male' | 'female';
}

export interface AuthResponse {
  token: string;
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
  isBooked: boolean;
  notes?: string | null;
}

export interface ListTimeSlotsParams {
  dentistId?: number | string;
  clinicId?: number | string;
  date?: string; // YYYY-MM-DD
  from?: string; // HH:mm or HH:mm:ss
  to?: string;   // HH:mm or HH:mm:ss
  isBooked?: boolean;
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
