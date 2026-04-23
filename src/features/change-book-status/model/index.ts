import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeBookingStatus } from "../api";
import {bookingKeys} from "@entities/booking/model/booking.model";
import {bookStatus} from "@shared/types/slot";
import Toast from "react-native-toast-message";

export const useChangeBookingStatus = (successCb:()=>void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }:{id:number,status:bookStatus,dentistId:number}) => changeBookingStatus(id, status),

    onSuccess: async(res) => {
      console.log( )
      Toast.show({
        type:  'success',
        text1: 'Запись удачно отменен!',
      });
       successCb()
       await queryClient.invalidateQueries({queryKey:['notifications']});
    },
  });
};
// {status:"upcoming",dentistId:res?.slot.dentistId }