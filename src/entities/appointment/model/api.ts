// src/entities/appointment/model/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {baseApi, queryKeys} from '@shared/api';
import { Appointment } from '@shared/types';
import { MOCK_APPOINTMENTS } from './mockData';

// локальный in-memory стор (пока нет бэкенда)
let _appointments: Appointment[] = [...MOCK_APPOINTMENTS];

async function fetchAppointments(): Promise<Appointment[]> {
  // return apiRequest<Appointment[]>('/appointments', { token });
  return new Promise(resolve => setTimeout(() => resolve([..._appointments]), 300));
}

async function createAppointment(apt: Omit<Appointment, 'id'>): Promise<Appointment> {
  return baseApi.post<Appointment>('/appointments', { method: 'POST', body: apt, });
}

async function cancelAppointment(id: string): Promise<void> {
  // return apiRequest<void>(`/appointments/${id}/cancel`, { method: 'POST', token });
  _appointments = _appointments.map(a =>
    a.id === id ? { ...a, status: 'cancelled' } : a,
  );
}

// ─── Хуки ─────────────────────────────────────────────────────────────────────

export function useAppointments() {

  return useQuery({
    queryKey: queryKeys.appointments.list(),
    queryFn: () => fetchAppointments(),
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (apt: Omit<Appointment, 'id'>) => createAppointment(apt),
    onSuccess: () => {
      // Инвалидируем кеш — список перезагрузится автоматически
      qc.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });
}
