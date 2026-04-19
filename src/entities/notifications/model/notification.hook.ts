import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { notificationApi } from "../api/notificationApi";
import {
  GetNotificationsParams, GetNotificationsResponse
} from "./types";
import {authQueryKeys } from "@shared/api";

export const notificationsKeys = {
  all: (params?: GetNotificationsParams) => ['notifications', params] as const,
};
export const useNotifications = (params?: GetNotificationsParams) => {
  return useQuery<GetNotificationsResponse>({
    queryKey: notificationsKeys.all(params),
    queryFn: async () => {
      return await notificationApi.getAll(params) || []
    },
  });
};

export const useNotification = (id: number) => {
  return useQuery<Notification>({
    queryKey: [notificationsKeys.all, id],
    queryFn: async () => {
      const { data } = await notificationApi.getOne(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Notification>) =>
      notificationApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      notificationApi.markAsRead(id),

    onSuccess: async() => {
      await queryClient.invalidateQueries({queryKey:notificationsKeys.all({})});
      authQueryKeys.me()
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationsKeys.all({}) });
      authQueryKeys.me()
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      notificationApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all({}) });
    },
  });
};