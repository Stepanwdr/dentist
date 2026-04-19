// src/shared/types/index.js

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  duration: string;
  price: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  serviceIds: string[];
  experience: string;
  rating: number;
  reviewsCount: number;
  initials: string;
  avatarColor: string;
  about: string;
  education: string;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  serviceId: string;
  dentistId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  serviceName: string;
  doctorName: string;
}

export interface Patient {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  allergies: string;
}

export interface BookingDraft {
  service: Service | null;
  doctor: Doctor | null;
  date: string | null;
  time: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  total?:number
  lastPage?:number
}
