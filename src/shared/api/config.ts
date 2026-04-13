// src/shared/api/config.ts

// Base URL for backend API
// Priority: EXPO_PUBLIC_API_URL (Expo), then API_URL, then fallback to localhost:5000
import Constants from "expo-constants";

export const API_BASE_URL =
  (typeof process !== 'undefined' && (process as any).env?.EXPO_PUBLIC_API_URL) ||
  (typeof process !== 'undefined' && (process as any).env?.API_URL) ||
  `http://${Constants.expoConfig?.hostUri?.split(":")[0]}:5000`;

