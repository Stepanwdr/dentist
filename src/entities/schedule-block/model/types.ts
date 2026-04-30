export type ScheduleBlockType = "break" | "dayoff" | "manual";

export interface ScheduleBlock {
  id: number;
  dentistId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: ScheduleBlockType;
  reason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleBlockListParams {
  dentistId?: number | string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: ScheduleBlockType;
}

export interface CreateScheduleBlockPayload {
  dentistId: number | string;
  date: string;
  startTime: string;
  endTime: string;
  type?: ScheduleBlockType;
  reason?: string | null;
}

export interface UpdateScheduleBlockPayload {
  id: number | string;
  dentistId?: number | string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: ScheduleBlockType;
  reason?: string | null;
}
