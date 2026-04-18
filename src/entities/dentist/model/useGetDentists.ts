import { useQuery } from "@tanstack/react-query";
import { baseApi } from "@shared/api";
import {Dentist} from "@shared/types/dentist";
export const usersKeys = {
  all: ['users'] as const,

  dentists: (params: {
    clinicId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    [
      ...usersKeys.all,
      'dentists',
      params.clinicId ?? '',
      params.search ?? '',
      params.page ?? 1,
      params.limit ?? 20,
    ] as const,
};



export interface GetDentistsParams {
  search?: string;
}

export function useGetDentists(params: GetDentistsParams) {
  const { search } = params;

  return useQuery<Dentist[], Error>({
    queryKey: usersKeys.dentists({search }),

    queryFn: async () => {
      const q = new URLSearchParams();

      if (search)   q.append("search", search);

      const res = await baseApi.get(
        `/users/dentist-list?${q.toString()}`
      ) as { dentists: Dentist[] };

      return res.dentists;
    },

    enabled: true,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}