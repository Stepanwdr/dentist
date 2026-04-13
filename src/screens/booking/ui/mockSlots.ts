// mockSlots.ts
// Генератор реалистичных тестовых слотов
// Имитирует расписание клиники с выходными, обедом и случайными занятыми

// ─── Конфиг расписания ────────────────────────────────────
import {TimeSlot} from "@shared/types/slot";

interface ScheduleConfig {
  /** Начало рабочего дня, напр. '09:00' */
  startTime?:   string;
  /** Конец рабочего дня, напр. '19:00' */
  endTime?:     string;
  /** Длина слота в минутах */
  slotMinutes?: number;
  /** Обед: начало и конец, напр. ['13:00', '14:00'] */
  lunch?:       [string, string] | null;
  /** Вероятность занятого слота 0–1 */
  busyRate?:    number;
  /** Воскресенье выходной */
  closedSunday?: boolean;
  /** Суббота: сокращённый день до ... */
  saturdayEnd?:  string | null;
}

const DEFAULT_CONFIG: Required<ScheduleConfig> = {
  startTime:    '09:00',
  endTime:      '19:00',
  slotMinutes:  30,
  lunch:        ['13:00', '14:00'],
  busyRate:     0.35,
  closedSunday: true,
  saturdayEnd:  '15:00',
};

// ─── Утилиты ──────────────────────────────────────────────

/** '09:00' → минуты от полуночи */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Минуты → '09:00' */
function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Детерминированный "псевдорандом" на основе строки → 0..1
 *  Один и тот же слот всегда даёт одно и то же значение — стабильные моки */
function stableRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % 1000) / 1000;
}

/** YYYY-MM-DD из Date */
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Основная функция ─────────────────────────────────────

/**
 * Генерирует слоты для заданной даты.
 *
 * @param date     - дата (Date object)
 * @param config   - настройки расписания (опционально)
 * @param dentistId - ID врача (влияет на занятость через seed)
 *
 * @returns BookingSlot[]  — пустой массив если выходной
 */
// export function generateMockSlots(
//   date:     Date,
//   config:   ScheduleConfig = {},
//   dentistId: string = 'doc-1',
// ): TimeSlot[] {
//   const cfg = { ...DEFAULT_CONFIG, ...config };
//   const dow = date.getDay(); // 0=Вс, 6=Сб
//
//   // Выходные
//   if (cfg.closedSunday && dow === 0) return [];
//
//   // Конец дня (суббота сокращённый)
//   const effectiveEnd = (dow === 6 && cfg.saturdayEnd)
//     ? cfg.saturdayEnd
//     : cfg.endTime;
//
//   const start  = toMinutes(cfg.startTime);
//   const end    = toMinutes(effectiveEnd);
//   const lunchS = cfg.lunch ? toMinutes(cfg.lunch[0]) : null;
//   const lunchE = cfg.lunch ? toMinutes(cfg.lunch[1]) : null;
//   const step   = cfg.slotMinutes;
//   const key    = dateKey(date);
//
//   const slots: TimeSlot[] = [];
//
//   for (let t = start; t + step <= end; t += step) {
//     // Пропускаем обед
//     if (lunchS !== null && lunchE !== null) {
//       if (t >= lunchS && t < lunchE) continue;
//     }
//
//     const startStr = fromMinutes(t);
//     const endStr   = fromMinutes(t + step);
//
//     // Детерминированная занятость
//     const seed   = `${key}-${dentistId}-${startStr}`;
//     const rnd    = stableRandom(seed);
//     const booked = rnd < cfg.busyRate;
//
//     slots.push({
//       startTime: "",
//       endTime: "",
//       id:       new Date().getMilliseconds(),
//       date:     `${startStr} – ${endStr}`,
//       duration: step,
//       isBooked:booked,
//     });
//   }
//
//   return slots;
// }

// ─── Вспомогательные функции ──────────────────────────────

/** Возвращает Set дат (YYYY-MM-DD) у которых есть хотя бы 1 свободный слот */
// export function getAvailableDates(
//   fromDate:  Date,
//   days:      number = 60,
//   config?:   ScheduleConfig,
//   dentistId?: string,
// ): Set<string> {
//   const result = new Set<string>();
//   for (let i = 0; i < days; i++) {
//     const d = new Date(fromDate);
//     d.setDate(fromDate.getDate() + i);
//     const slots = generateMockSlots(d, config, dentistId);
//     if (slots.some(s => !s.isBooked)) {
//       result.add(dateKey(d));
//     }
//   }
//   return result;
// }
//
// /** Первый свободный слот в дату */
// export function firstAvailableSlot(
//   date:     Date,
//   config?:  ScheduleConfig,
//   dentistId?: string,
// ): TimeSlot | null {
//   const slots = generateMockSlots(date, config, dentistId);
//   return slots.find(s => !s.isBooked) ?? null;
// }

export { dateKey };
