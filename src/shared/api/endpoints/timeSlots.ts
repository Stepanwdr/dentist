// src/shared/api/endpoints/timeSlots.ts
import { baseApi } from '../baseApi';
import type {
  ApiResponse,
  TimeSlotDTO,
  ListTimeSlotsParams,
  CreateTimeSlotBody,
  CreateBatchBody,
  UpdateTimeSlotBody,
} from '../types';

export const timeSlotsApi = {
  async list(params?: ListTimeSlotsParams) {
    return baseApi.get<ApiResponse & { slots: TimeSlotDTO[] }>(`/time-slots`, params);
  },

  async create(body: CreateTimeSlotBody) {
    return baseApi.post<ApiResponse & { slot: TimeSlotDTO }>(`/time-slots`, body);
  },

  async createBatch(body: CreateBatchBody) {
    return baseApi.post<
      ApiResponse & { createdCount: number; skippedCount: number; created: TimeSlotDTO[]; skipped: Array<{ startTime: string; endTime: string }> }
    >(`/time-slots/batch`, body);
  },

  async update(id: number | string, body: UpdateTimeSlotBody) {
    return baseApi.patch<ApiResponse & { slot: TimeSlotDTO }>(`/time-slots/${id}`, body);
  },

  async remove(id: number | string) {
    return baseApi.delete<ApiResponse>(`/time-slots/${id}`);
  },
};

export default timeSlotsApi;
