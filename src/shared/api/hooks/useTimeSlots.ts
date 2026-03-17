// src/shared/api/hooks/useTimeSlots.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { timeSlotsApi } from '../endpoints/timeSlots';
import type {
  ListTimeSlotsParams,
  CreateTimeSlotBody,
  CreateBatchBody,
  UpdateTimeSlotBody,
  TimeSlotDTO,
  ApiResponse,
} from '../types';

// Queries
export function useTimeSlotsQuery(filters?: ListTimeSlotsParams, options?: {
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.timeSlots.list(filters),
    queryFn: async () => {
      const res = await timeSlotsApi.list(filters);
      // Expecting { status: 'ok', slots: TimeSlotDTO[] }
      return res.slots as TimeSlotDTO[];
    },
    enabled: options?.enabled,
  });
}

// Mutations
export function useCreateTimeSlotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTimeSlotBody) => timeSlotsApi.create(body),
    onSuccess: () => {
      // Invalidate all timeSlots lists
      qc.invalidateQueries({ queryKey: queryKeys.timeSlots.root });
    },
  });
}

export function useCreateBatchTimeSlotsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBatchBody) => timeSlotsApi.createBatch(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.timeSlots.root });
    },
  });
}

export function useUpdateTimeSlotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: UpdateTimeSlotBody }) => timeSlotsApi.update(id, body),
    onSuccess: (res) => {
      // Update detail cache if present and invalidate lists
      const slot = (res as ApiResponse & { slot: TimeSlotDTO }).slot;
      if (slot) {
        qc.setQueryData(queryKeys.timeSlots.detail(slot.id), (prev: any) => ({ ...(prev || {}), ...slot }));
      }
      qc.invalidateQueries({ queryKey: queryKeys.timeSlots.root });
    },
  });
}

export function useDeleteTimeSlotMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => timeSlotsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.timeSlots.root });
    },
  });
}
