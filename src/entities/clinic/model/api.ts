// src/entities/clinic/model/api.ts
import { useQuery } from '@tanstack/react-query';
import {baseApi} from '@shared/api';
import { Clinic } from './types';

export function useClinic(clinicId: number) {
  return useQuery({
    queryKey: ['clinic', clinicId],
    queryFn: () =>
    baseApi.get<Clinic>(`/clinics/${clinicId}`),
    staleTime: 1000 * 60 * 10, // клиника меняется редко — кешируем на 10 мин
  });
}
