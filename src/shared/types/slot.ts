// export interface TimeSlot {
//   id?:         number;
//   startTime?:  string;    // '09:00'
//   endTime?:    string;    // '09:30'
//   duration:   number;    // минуты
//   isBooked:     boolean;
//   // Опционально:
//   dentistId?:  string;
//   price?:     number;
//   label?:     string;
//   date?:      Date// кастомное название слота
//   time?:      string
//   start:string
//   end:string
//   notes:string
// }

import { Dentist } from "./dentist";

// shared/types/slot.ts

export type bookStatus= 'pending' | 'confirmed'| 'canceled'| 'finished'

export interface TimeSlot {
  id:         number;
  date:       string;        // 'YYYY-MM-DD'
  startTime:  string;        // '09:00:00'
  endTime:    string;        // '09:30:00'
  disabled?:  boolean;
  disabledReason?: string;
  notes:      string | null;
  dentistId:  number;
  clinicId:   number | null;
  dentist:    Dentist | null;
  clinic:     { id: number; name: string, address:string } | null;
  createdAt:  string;
  updatedAt:  string;
  duration:   number;
  status:   bookStatus;
  service: string
  isBooked?:  boolean;
}

export interface TimelineDate {
  month: string;
  day: number;
  done: boolean;
  isNext?: boolean;
}

