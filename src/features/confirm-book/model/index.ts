import { useMutation, useQueryClient } from '@tanstack/react-query';
import {confirmBook} from "../api";
import {bookStatus} from "@shared/types/slot";
import Toast from "react-native-toast-message";

export const useConfirmBookStatus = (successCb:()=>void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }:{id:number}) => confirmBook(id),

    onSuccess: async(res) => {
      console.log( )
      Toast.show({
        type:  'success',
        text1: 'Запись удачно подтвержден!',
      });
       successCb()
       await queryClient.invalidateQueries({queryKey:['notifications']});
    },
  });
};
