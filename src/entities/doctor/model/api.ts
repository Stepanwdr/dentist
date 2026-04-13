import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/api';
import { Doctor } from '@shared/types';
import { DOCTORS } from './mockData';

async function fetchDoctorsByService(serviceId: string): Promise<Doctor[]> {
  // return apiRequest<Doctor[]>(`/doctors?serviceId=${serviceId}`, { token });
  return new Promise(resolve =>
    setTimeout(() => resolve(DOCTORS.filter(d => d.serviceIds.includes(serviceId))), 300),
  );
}

export function useDoctors(serviceId: string) {

  return useQuery({
    queryKey: queryKeys.doctors.byService(serviceId),
    queryFn: () => fetchDoctorsByService(serviceId),
  });
}
