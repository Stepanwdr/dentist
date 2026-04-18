import {
  GetNotificationsParams, GetNotificationsResponse
} from "../model/types";
import { baseApi } from "@shared/api";
import { Notification } from "@shared/types/notifications";

export const notificationApi = {
  getAll: async (params?: GetNotificationsParams) =>{
    try {
      return await baseApi.get<Promise<GetNotificationsResponse>>("/notifications/getAll", params)
    }catch(error){}
  },


  getOne: (id: number) =>
    baseApi.get<Notification>(`/notifications/${id}`),

  create: (data: Partial<Notification>) =>
    baseApi.post<Notification>("/notifications", data),

  markAsRead: (id: number) =>
    baseApi.patch<{ success: boolean }>(
      `/notifications/markAsRead/${id}`
    ),

  markAllAsRead: () =>
    baseApi.patch<{ success: boolean }>(
      "/notifications/markAllAsRead"
    ),

  delete: (id: number) =>
    baseApi.delete<{ success: boolean }>(
      `/notifications/${id}`
    ),
};