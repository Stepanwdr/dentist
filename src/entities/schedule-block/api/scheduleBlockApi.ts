import { ApiResponse, baseApi } from "@shared/api";
import {
  CreateScheduleBlockPayload,
  ScheduleBlock,
  ScheduleBlockListParams,
  UpdateScheduleBlockPayload,
} from "../model/types";

export interface ScheduleBlocksResponse extends ApiResponse {
  blocks: ScheduleBlock[];
}

export interface ScheduleBlockResponse extends ApiResponse {
  block: ScheduleBlock;
}

export const scheduleBlockApi = {
  list: async (params?: ScheduleBlockListParams) => {
    return await baseApi.get<ScheduleBlocksResponse>("/scheduleBlock/list", params);
  },

  create: async (body: CreateScheduleBlockPayload) => {
    return await baseApi.post<ScheduleBlockResponse, CreateScheduleBlockPayload>(
      "/scheduleBlock/create",
      body
    );
  },

  update: async ({ id, ...body }: UpdateScheduleBlockPayload) => {
    return await baseApi.patch<ScheduleBlockResponse, Omit<UpdateScheduleBlockPayload, "id">>(
      `/scheduleBlock/${id}`,
      body
    );
  },

  delete: async (id: number | string) => {
    return await baseApi.delete<ApiResponse>(`/scheduleBlock/${id}`);
  },
};
