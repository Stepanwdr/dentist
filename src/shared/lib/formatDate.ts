// src/shared/lib/formatDate.ts
import { getMonthName, getDayNameShort } from '@shared/i18n/core';

export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getDate()} ${getMonthName(date.getMonth(), 'full')} ${date.getFullYear()}`;
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getDate()} ${getMonthName(date.getMonth(), 'short')}`;
}

export interface CalendarDay {
  date: Date;
  key: string; // ISO date string YYYY-MM-DD
  dayName: string;
  dayNum: number;
  month: string;
  isWeekend: boolean;
  isToday: boolean;
}

export function generateCalendarDays(count = 30): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dow = date.getDay();
    days.push({
      date,
      key: date.toISOString().split('T')[0],
      dayName: getDayNameShort(dow),
      dayNum: date.getDate(),
      month: getMonthName(date.getMonth(), 'short'),
      isWeekend: dow === 0 || dow === 6,
      isToday: i === 0,
    });
  }
  return days;
}

export const formatDateYMD = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};