// src/entities/appointment/model/mockData.ts
import { Appointment } from '@shared/types';

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    serviceId: '4',
    dentistId: '1',
    date: '2024-01-20',
    time: '11:00',
    status: 'completed',
    serviceName: 'Гигиена',
    doctorName: 'Иванова М.С.',
  },
  {
    id: 'a2',
    serviceId: '1',
    dentistId: '4',
    date: '2024-02-05',
    time: '14:30',
    status: 'completed',
    serviceName: 'Терапия',
    doctorName: 'Козлов Д.А.',
  },
];

export const TIME_SLOTS: string[] = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

// doctorId_YYYY-MM-DD → occupied slots
export const BUSY_SLOTS: Record<string, string[]> = {
  '1_2024-02-15': ['09:00', '10:00', '14:00', '15:30'],
  '1_2024-02-16': ['09:30', '11:00', '13:00', '16:00'],
  '2_2024-02-15': ['09:00', '09:30', '10:00', '10:30'],
  '3_2024-02-16': ['14:00', '14:30', '15:00'],
  '4_2024-02-17': ['09:00', '12:00', '13:00', '17:00'],
};
