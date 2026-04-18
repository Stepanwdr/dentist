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

const QUERY_KEY = ["notifications"];

export const useNotifications = (params?: GetNotificationsParams) => {
  console.log({params},'hook')
  return useQuery<GetNotificationsResponse>({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      return await notificationApi.getAll(params)
    },
  });
};

export const useNotification = (id: number) => {
  return useQuery<Notification>({
    queryKey: [...QUERY_KEY, id],
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      notificationApi.markAsRead(id),

    onSuccess: async() => {
      await queryClient.invalidateQueries({ queryKey: [...QUERY_KEY], });
      authQueryKeys.me()
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};