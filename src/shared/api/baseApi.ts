import axios, { AxiosError } from "axios";

import Constants from "expo-constants";
import { tokenStorage } from "@shared/lib/tokenStorage";

// const API_BASE_URL=  `http://${Constants.expoConfig?.hostUri?.split(":")[0]}:5000`;
const API_BASE_URL=  `http://cp5rdf-ip-217-76-10-15.tunnelmole.net`;
function handleError(error: AxiosError): never {
  const apiError: ApiError = new Error(
    (error.response?.data as any)?.message || (error.response?.data)
  );

  apiError.status = error.response?.status;
  apiError.data = error.response?.data;

  throw apiError;
}
export interface ApiError extends Error {
  status?: number;
  data?: any;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();

      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {
          refreshToken,
        }
      );

      const newAccess = res.data.access_token;

      await tokenStorage.saveTokens(newAccess,'' );

      processQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      throw err;
    } finally {
      isRefreshing = false;
    }
  }
);

export const baseApi = {
  async get<T>(path: string, params?: Record<string, any>) {
    try {
      const res = await api.get<T>(path, { params });
      return res.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  async post<T, B = any>(path: string, body?: B) {
    try {

      const res = await api.post<T>(path, body);
      return res.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  async patch<T, B = any>(path: string, body?: B) {
    try {
      const res = await api.patch<T>(path, body);
      return res.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  async delete<T>(path: string) {
    try {
      const res = await api.delete<T>(path);
      return res.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};