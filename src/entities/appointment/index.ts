// src/entities/appointment/index.ts
export { MOCK_APPOINTMENTS, TIME_SLOTS, BUSY_SLOTS } from './model/mockData';
export { STATUS_CONFIG } from './model/statusConfig';
export { AppointmentCard } from './ui/AppointmentCard';
export type { Appointment, AppointmentStatus } from '@shared/types';
export { useAppointments, useCreateAppointment, useCancelAppointment } from './model/api';
