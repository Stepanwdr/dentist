import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/login";
import {tokenStorage} from "@shared/lib/tokenStorage";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginRequest,

    onSuccess: async (data) => {
      await tokenStorage.saveTokens(data.token,'');
    }
  });
};