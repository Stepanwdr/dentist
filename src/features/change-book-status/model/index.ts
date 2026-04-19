import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeBookingStatus } from "../api";
import {bookingKeys} from "@entities/booking/model/booking.model";
import {bookStatus} from "@shared/types/slot";
import Toast from "react-native-toast-message";

export const useChangeBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }:{id:number,status:bookStatus}) => changeBookingStatus(id, status),

    onSuccess: async() => {
      Toast.show({
        type:  'success',
        text1: 'Запись удачно отменен!',
      });
      await queryClient.invalidateQueries({queryKey:['notifications']});
    },
  });
};