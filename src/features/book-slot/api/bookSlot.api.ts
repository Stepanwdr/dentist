// features/book-slot/api/bookSlot.api.ts

import {ApiResponse, baseApi} from '@shared/api';
import {TimeSlot} from "@shared/types/slot";

const BASE_URL = 'https://api.dentist.com/v1'; // ← замени

// ─── Params / Response types ───────────────────────────
export interface GetSlotsParams {
  dentistId?:   string;
  date?:       string;   // 'YYYY-MM-DD'
  serviceId?: string;
  status?: string;
  isBusySlots?: boolean;
}

export interface BookSlotParams {
  dentistId:  number;
  date?:       string;
  serviceId?: string;
  notes:      string;
  startTime:  string;
  endTime:    string;
  service:    string;
}

export interface EditBookParams extends BookSlotParams {
  id: number;
}

export interface BookSlotResponse extends ApiResponse {
 slot: TimeSlot
}
// ─── fetchAvailableDates ───────────────────────────────
export async function fetchAvailableDates(
  dentistId: string,
  from:     string,
  to:       string,
): Promise<string[]> {
  try {
    const q = new URLSearchParams({ doctor_id: dentistId, from, to });

    const res = await fetch(`${BASE_URL}/slots/available-dates?${q}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`fetchAvailableDates: ${res.status}`);

    const data = await res.json();
    return data.dates as string[];
  } catch (e) {
    console.error('[bookSlot.api] fetchAvailableDates:', e);
    throw e;
  }
}

// ─── bookSlotRequest ───────────────────────────────────
export async function bookSlotRequest(params: BookSlotParams): Promise<BookSlotResponse> {
  try {
    const res = await baseApi.post(`/booking/slot`, {
      dentistId:  params.dentistId,
      date:       params?.date,
      service_id: params?.serviceId,
      startTime:  params.startTime,
      endTime:    params.endTime,
      notes:      params.notes,
      service:    params.service
    }) as BookSlotResponse;
    return res
  } catch (e) {
    console.error('[bookSlot.api] bookSlotRequest:', e);
    throw e;
  }
}

export async function editBookRequest(params: EditBookParams): Promise<BookSlotResponse> {
  try {
    const res = await baseApi.patch(`/booking/${params.id}`, {
      dentistId:  params.dentistId,
      date:       params?.date,
      service_id: params?.serviceId,
      startTime:  params.startTime,
      endTime:    params.endTime,
      notes:      params.notes,
      service:    params.service
    }) as BookSlotResponse;
    return res
  } catch (e) {
    console.error('[bookSlot.api] editBookRequest:', e);
    throw e;
  }
}
