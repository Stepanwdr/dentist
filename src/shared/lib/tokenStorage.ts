import * as SecureStore from 'expo-secure-store';

const KEYS = {
  access: 'token',
  refresh: 'refresh_token',
} as const;

export const tokenStorage = {
  async saveTokens(access: string, refresh: string) {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.access, access),
      SecureStore.setItemAsync(KEYS.refresh, refresh),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.access);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.refresh);
  },

  async clearTokens() {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.access),
      SecureStore.deleteItemAsync(KEYS.refresh),
    ]);
  },
};