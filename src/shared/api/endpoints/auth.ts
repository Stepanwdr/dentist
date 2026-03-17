// src/shared/api/endpoints/auth.ts
import { baseApi } from '../baseApi';
import type { ApiResponse, AuthResponse, LoginBody, RegisterBody, AuthUser } from '../types';

export interface ServerTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}


export const authApi = {
  async login(body: LoginBody) {
    // Expected backend response shape: { status: 'ok', token: string, user: {...} }
    return baseApi.post<ApiResponse & AuthResponse, LoginBody>(`/auth/login`, body);
  },

  async register(body: RegisterBody) {
    // Some backends also return token on register; we keep type compatible
    return baseApi.post<ApiResponse & Partial<AuthResponse>, RegisterBody>(`/auth/register`, body);
  },

  async me() {
    // Expected: { status: 'ok', user: {...} }
    return baseApi.get<ApiResponse & { user: AuthUser }>(`/users/account`);
  },


// Вход через Google — шлём Google idToken на сервер
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return baseApi.post<AuthResponse>('/auth/google', {
      method: 'POST',
      body: { idToken },
    });
  },

// Вход через телефон — шлём Firebase idToken после OTP
  async loginWithPhone(firebaseIdToken: string): Promise<AuthResponse> {
    return baseApi.post<AuthResponse>('/auth/phone', {
      method: 'POST',
      body: { firebaseIdToken },
    });
  },

// Обновление accessToken
  async refreshTokens(refreshToken: string): Promise<ServerTokens> {
    return baseApi.post<ServerTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  }
};

export default authApi;
