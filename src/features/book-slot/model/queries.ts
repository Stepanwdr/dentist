import {BookSlotParams, bookSlotRequest, BookSlotResponse, EditBookParams, editBookRequest, fetchAvailableDates} from "../api/bookSlot.api";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from "react-native-toast-message";
import {bookingKeys} from "@entities/booking/model/booking.model";
import {TimeSlot} from "@shared/types/slot";

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
          text2: `${data.slot.date}`,
        });
        await queryClient.invalidateQueries({
          queryKey:bookingKeys.all(),
        });
        return;
      }

      if (error) {
        Toast.show({
          type:  'error',
          text1: error.message,
        });
        await queryClient.invalidateQueries({
          queryKey:bookingKeys.all(),
        });
      }
    },

    // Инвалидируем кэш после успеха
    onSuccess: async(_data, params) => {
      onSuccess?.(_data.slot);
      Toast.show({
        type:  'success',
        text1: 'Запись создана!',
        text2: `${_data.slot.date}`,
      });
     await queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });

    },
  });
}

export function useEditBook(onSuccess?: (payload: TimeSlot)=> void ){
  const queryClient = useQueryClient();
  return useMutation<BookSlotResponse, Error, EditBookParams>({
    mutationFn: async (params) => {
      return editBookRequest(params)
    },
    onSettled:async(data,error) => {
      if (data) {
        onSuccess?.(data?.slot);
        Toast.show({
          type:  'success',
          text1: 'Запись обновлена!',
          text2: `${data.slot.date}`,
        });
        await queryClient.invalidateQueries({
          queryKey: bookingKeys.all()
        });
        return;
      }

      if (error) {
        Toast.show({
          type:  'error',
          text1: error.message,
        });
        await queryClient.invalidateQueries({
          queryKey:bookingKeys.all(),
        });
      }
    },
  });
}
