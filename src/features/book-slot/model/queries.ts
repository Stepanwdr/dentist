import {BookSlotParams, bookSlotRequest, BookSlotResponse, fetchAvailableDates} from "../api/bookSlot.api";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from "react-native-toast-message";
import {bookingKeys} from "@entities/booking/model/booking.model";
import {TimeSlot} from "@shared/types/slot";

const USE_MOCK = false;

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

// ─────────────────────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────────────────────
export const bookSlotKeys = {
  all:            ['book-slot'] as const,
  slots:          (dentistId: string, date: string) =>
    [...bookSlotKeys.all, 'slots']
  // book:['book-slot', 'book'],
  // availableDates: () =>
  //   [...bookSlotKeys.all, 'available-dates'] as const,
};

// ─────────────────────────────────────────────────────────
// SLOTS QUERY
// ─────────────────────────────────────────────────────────
// export function slotsQueryOptions(dentistId: string, date: string, serviceId?: string) {
//   const dateStr = toKey(date);
//   return {
//     queryKey: bookSlotKeys.slots(date),
//     queryFn:  async () => {
//       if (USE_MOCK) {
//         await new Promise(r => setTimeout(r, 280));
//         return mockSlots(date, dentistId);
//       }
//       return fetchSlots({ dentistId, date: dateStr, serviceId });
//     },
//     staleTime:        30_000,     // 30 сек — не рефетчим зря
//     gcTime:           5 * 60_000, // 5 мин в кэше
//     retry:            2,
//     refetchOnWindowFocus: false,
//   };
// }

// ─────────────────────────────────────────────────────────
// AVAILABLE DATES QUERY
// ─────────────────────────────────────────────────────────
// export function availableDatesQueryOptions(dentistId: string) {
//   return {
//     queryKey: bookSlotKeys.availableDates(),
//     queryFn:  async (): Promise<Set<string>> => {
//       if (USE_MOCK) {
//         return availableDatesSet(new Date(), 90, dentistId);
//       }
//       const today   = toKey(new Date());
//       const future  = toKey(new Date(Date.now() + 90 * 86_400_000));
//       const dates   = await fetchAvailableDates(dentistId, today, future);
//       return new Set(dates);
//     },
//     staleTime:        10 * 60_000, // 10 мин
//     gcTime:           30 * 60_000,
//     refetchOnWindowFocus: false,
//   };
// }

// ─────────────────────────────────────────────────────────
// BOOK SLOT MUTATION
// ─────────────────────────────────────────────────────────
// features/book-slot/hooks/useBookSlot.ts


// ─── Mock fn ──────────────────────────────────────────
async function mockBookSlot(params: BookSlotParams): Promise<BookSlotResponse> {
  await new Promise(r => setTimeout(r, 600));
  return {

  } as BookSlotResponse;
}

export function useBookSlot(onSuccess?: (payload: TimeSlot)=> void ){
  const queryClient = useQueryClient();
  return useMutation<BookSlotResponse, Error, BookSlotParams>({
    // Оптимистичное обновление — слот занят сразу
    mutationFn: async (params) => {
      return bookSlotRequest(params)
    },
    onSettled:async(data,error,params) => {

      if (data) {
        onSuccess?.(data?.slot);
        Toast.show({
          type:  'success',
          text1: 'Запись создана!',
          text2: `${params.date}`,
        });
        await queryClient.invalidateQueries({
          queryKey:bookingKeys.all,
        });
        return;
      }

      if (error) {
        Toast.show({
          type:  'error',
          text1: error.message,
        });
        queryClient.invalidateQueries({
          queryKey:bookingKeys.all,
        });
      }
    },

    // Инвалидируем кэш после успеха
    onSuccess: (_data, params) => {
      onSuccess?.(_data);
      Toast.show({
        type:  'success',
        text1: 'Запись создана!',
        text2: `${params.date}`,
      });
      queryClient.invalidateQueries({
        queryKey:bookingKeys.all,
      });

    },
  });
}