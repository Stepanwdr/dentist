// ─── Hook ─────────────────────────────────────────────
import {useQuery} from "@tanstack/react-query";
import {TimeSlot} from "@shared/types/slot";
import {fetchSlots} from "@entities/booking/api/bookingApi";
import {baseApi} from "@shared/api";

// ─── Query key factory ────────────────────────────────
export const bookingKeys = {
  all:   ['bookings'] as const,
  slots: (dentistId: string, date: string) =>
    [...bookingKeys.all, 'slots', dentistId, date] as const,
  next: () =>
    [...bookingKeys.all, 'next'] as const,
};

export interface GetAvailableDatesParams {
  dentistId: string;
  from:      string; // 'YYYY-MM-DD'
  to:        string; // 'YYYY-MM-DD'
}
export function useGetBookings(
  params: {
   date: string,
   dentistId:  string,
   serviceId?: string,
  }
) {
  const { dentistId, serviceId, date} = params;
  return useQuery<TimeSlot[], Error>({
    queryKey: bookingKeys.slots(dentistId,date),
    queryFn:  async () => {
      // if (USE_MOCK) {
      //   await new Promise(r => setTimeout(r, 280));
      //   return mockSlots(new Date(params.date), dentistId);
      // }
      const data= await fetchSlots({ dentistId:params.dentistId, date, serviceId });


      return data.map((s: any): TimeSlot => ({
        id:        s.id,
        startTime: s.startTime,   // '09:00:00'
        endTime:   s.endTime,     // '09:30:00'
        date:      s.date,        // '2026-03-22'
        isBooked:  s.isBooked,
        notes:     s.notes,
        dentistId: s.dentistId,
        clinicId:  s.clinicId,
        dentist:   s.dentist,
        clinic:    s.clinic,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        duration:  s.duration,
        status:    s.status,
        service:   s.service,
      }));
    },
      staleTime:            30_000,
      gcTime:               5 * 60_000,
      retry:                2,
      refetchOnWindowFocus: false,
      enabled: !!params.date && !!dentistId,
  });
}
export function useGetAvailableDates(params: GetAvailableDatesParams) {
  const { dentistId, from, to } = params;

  return useQuery<Set<string>, Error>({
    queryKey: [...bookingKeys.all, 'available-dates', dentistId, from, to],
    queryFn:  async () => {
      // if (USE_MOCK) {
      //   const { availableDatesSet } = await import('@features/book-slot/api/mocks');
      //   return availableDatesSet(new Date(from), 90, dentistId);
      // }

      const q   = new URLSearchParams({  dentistId, from, to });
      const res = await baseApi.get(`/booking/available-dates?${q}`) as { dates: string[] };
      // data.dates = ['2026-03-21', '2026-03-22', ...]
      return new Set<string>(res.dates);
    },
    enabled:              !!dentistId && !!from && !!to,
    staleTime:            10 * 60_000, // 10 мин — даты меняются редко
    gcTime:               30 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useGetNextBooking() {
  return useQuery<TimeSlot | null, Error>({
    queryKey: bookingKeys.next(),
    queryFn: async () => {
      const res = await baseApi.get(
        `/booking/next`
      ) as TimeSlot;

      return res.slot
    },

    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

}