// src/shared/api/queryKeys.ts

export const queryKeys = {
  services: {
    all: ['services'] as const,
    list: () => [...queryKeys.services.all, 'list'] as const,
  },
  doctors: {
    all: ['doctors'] as const,
    list: () => [...queryKeys.doctors.all, 'list'] as const,
    byService: (serviceId: string) =>
      [...queryKeys.doctors.all, 'byService', serviceId] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: () => [...queryKeys.appointments.all, 'list'] as const,
  },
  patient: {
    all: ['patient'] as const,
    me: () => [...queryKeys.patient.all, 'me'] as const,
  },
} as const;
