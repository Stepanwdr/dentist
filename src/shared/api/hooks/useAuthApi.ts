import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../endpoints/auth';
import type { ApiResponse, AuthResponse, AuthUser, LoginBody, RegisterBody } from '../types';
import {tokenStorage} from "@shared/lib/tokenStorage";
import {useAuth} from "@features/auth/model/useAuth";

export const authQueryKeys = {
  root: ['auth'] as const,
  me: () => [...authQueryKeys.root, 'me'] as const,
};

export function useMeQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      const res = await authApi.me();
      console.log(res)
      return res.data as AuthUser;
    },
  });
}

export function useLoginMutation(onSuccess?: (payload: AuthResponse & ApiResponse) => void) {
  const qc = useQueryClient();
  const { login } = useAuth()
  return useMutation({
    mutationKey: [...authQueryKeys.root, 'login'],
    mutationFn: async (body: LoginBody) => {
      const res = await authApi.login(body);
       await tokenStorage.saveTokens(res.token,'')
      return res as AuthResponse & ApiResponse;
    },
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: authQueryKeys.me() });
      await login(data.token,data?.user)
      onSuccess?.(data);
    },
    onError: (err) => {
      alert(err.message);
    }
  });
}

export function useRegisterMutation(onSuccess?: (payload: Partial<AuthResponse> & ApiResponse) => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: [...authQueryKeys.root, 'register'],
    mutationFn: async (body: RegisterBody) => {
      const res = await authApi.register(body);
      return res as Partial<AuthResponse> & ApiResponse;
    },
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: authQueryKeys.me() });
      console.log(data)
      onSuccess?.(data);
    },
  });
}
