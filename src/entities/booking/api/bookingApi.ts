// features/book-slot/hooks/useGetBookings.ts

import { useQuery } from '@tanstack/react-query';
import {TimeSlot} from "@shared/types/slot";
import {GetSlotsParams} from "@features/book-slot/api/bookSlot.api";
import {ApiResponse, baseApi} from "@shared/api";

const USE_MOCK = true; // ← false когда готов реальный API

// ─── dateToSlot ───────────────────────────────────────
// Date → { date: 'YYYY-MM-DD', startTime: 'HH:mm:ss', endTime: 'HH:mm:ss' }
export function dateToSlot(date: Date): Pick<GetSlotsParams, 'date'> & {
  startTime: string;
  endTime:   string;
} {
  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:00`;

  const end = new Date(date);
  end.setMinutes(end.getMinutes() + 30);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return {
    date:      `${y}-${m}-${d}`,
    startTime: fmt(date),
    endTime:   fmt(end),
  };
}


interface slotsResponse extends ApiResponse {
  slots: TimeSlot[]
}

interface slotResponse extends ApiResponse {
  slot: TimeSlot
}
export async function fetchSlots(params: GetSlotsParams): Promise<TimeSlot[]> {
  try {
    const q = new URLSearchParams({
      dentistId: params?.dentistId || '',
      date:      params?.date || '',
      isBusySlots: params.isBusySlots ? 'true' : '',
     ...(params?.status ? { status: params?.status } : {}),
    })

    console.log({q})
    const res  = await baseApi.get(`booking/bookings?${q}`) as slotsResponse;

    return res.slots as TimeSlot[];


  } catch (e) {
    console.error('[bookSlot.api] fetchSlots:', e);
    throw e;
  }
}

export async function fetchBookingById(id: number | string): Promise<TimeSlot> {
  try {
    const res  = await baseApi.get(`booking/${id}`) as slotResponse;
    return res.slot as TimeSlot;
  } catch (e) {
    console.error('[bookingApi] fetchBookingById:', e);
    throw e;
  }
}
