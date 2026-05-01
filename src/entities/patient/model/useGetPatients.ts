import { useQuery } from "@tanstack/react-query";
import { baseApi } from "@shared/api";
import {Patient} from "@shared/types/patient";
export const usersKeys = {
  all: ['users'] as const,

  patients: (params: {
    dentistId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    [
      ...usersKeys.all,
      'patients',
      params.dentistId ?? '',
      params.search ?? '',
      params.page ?? 1,
      params.limit ?? 20,
    ] as const,
};



export interface Params {
  search?: string;
}

export function useGetPatients(params: Params) {
  const { search } = params;

  return useQuery<Patient[], Error>({
    queryKey: usersKeys.patients({ search }),

    queryFn: async () => {
      const q = new URLSearchParams();

      if (search)   q.append("search", search);

      const res = await baseApi.get(
        `/users/patient-list?${q.toString()}`
      ) as { patients: Patient[] };

      return res.patients;
    },

    enabled: true,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}