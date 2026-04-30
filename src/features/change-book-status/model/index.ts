import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeBookingStatus } from "../api";
import {bookStatus} from "@shared/types/slot";
import Toast from "react-native-toast-message";

export const useChangeBookingStatus = (successCb:()=>void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }:{id:number,status:bookStatus}) => changeBookingStatus(id, status),

    onSuccess: async(res) => {
      Toast.show({
        type:  'success',
        text1: 'Запись удачно отменен!',
      });
       successCb()
       await queryClient.invalidateQueries({queryKey:['notifications']});
    },
  });
};
