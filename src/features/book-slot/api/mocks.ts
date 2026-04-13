import {addMin, dk, stableRng} from "@features/book-slot/lib";
import {TimeSlot} from "@shared/types/slot";
import { times } from "@shared/lib/boooking";

// export function mockSlots(date: Date, dentistId = 'doc-1'): TimeSlot[] {
//   const dow = date.getDay();
//   if (dow === 0) return [];
//   const limit = dow === 6 ? 14 : 19;
//   const dKey  = dk(date);
//   return times
//     .filter(t => parseInt(t) < limit)
//     .map(start => ({
//       id:       new Date().getMilliseconds(),
//       startTime:start,
//       endTime:  addMin(start, 30),
//       duration: 30,
//       isBooked:   stableRng(`${dKey}-${dentistId}-${start}`) < 0.3,
//     }));
// }
// export function availableDatesSet(from: Date, days = 90, dentistId = 'doc-1',slots:TimeSlot[]): Set<string> {
//   const s = new Set<string>();
//   for (let i = 0; i < days; i++) {
//     const d = new Date(from); d.setDate(from.getDate() + i);
//     if (slots.some(x => !x.isBooked)) s.add(dk(d));
//   }
//   return s;
// }
