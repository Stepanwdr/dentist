import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  scheduleBlockApi,
  ScheduleBlockResponse,
  ScheduleBlocksResponse,
} from "../api/scheduleBlockApi";
import {
  CreateScheduleBlockPayload,
  ScheduleBlockListParams,
  UpdateScheduleBlockPayload,
} from "./types";
import Toast from "react-native-toast-message";

export const scheduleBlockKeys = {
  all: () => ["schedule-blocks"] as const,
  lists: () => [...scheduleBlockKeys.all(), "list"] as const,
  list: (params?: ScheduleBlockListParams) =>
    [...scheduleBlockKeys.lists(), params ?? {}] as const,
};

export function useScheduleBlocks(params?: ScheduleBlockListParams) {
  return useQuery<ScheduleBlocksResponse, Error>({
    queryKey: scheduleBlockKeys.list(params),
    queryFn: async () => {
      return await scheduleBlockApi.list(params);
    },
  });
}

export function useCreateScheduleBlock() {
  const queryClient = useQueryClient();

  return useMutation<ScheduleBlockResponse, Error, CreateScheduleBlockPayload>({
    mutationFn: async (body) => {

      return await scheduleBlockApi.create(body);
    },
    onSuccess: async () => {
      Toast.show({
        type:  'success',
        text1: 'Время записи закрыт!',
      });
      await queryClient.invalidateQueries({ queryKey: scheduleBlockKeys.all() });
    },
  });
}

export function useUpdateScheduleBlock() {
  const queryClient = useQueryClient();

  return useMutation<ScheduleBlockResponse, Error, UpdateScheduleBlockPayload>({
    mutationFn: async (body) => {
      return await scheduleBlockApi.update(body);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: scheduleBlockKeys.all() });
    },
  });
}

export function useDeleteScheduleBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      return await scheduleBlockApi.delete(id);
    },
    onSuccess: async () => {
      Toast.show({
        type:  'success',
        text1: 'Время записи открыт!',
      });
      await queryClient.invalidateQueries({ queryKey: scheduleBlockKeys.all() });
    },
  });
}
