// Centralized local-date utilities to avoid timezone bugs
// All UI logic should operate on local days (YYYY-MM-DD) and Str keys

// (no extra dependencies)

// Returns a day key in local time: YYYY-MM-DD
export function toDayKey(date: Date): string {
  const d = new Date(date); // ensure we don't mutate input
  // Local date components
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Returns a Date object representing the local date at midnight (00:00:00) in the user's timezone
export function fromDayKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  // month in Date is 0-based
  const d = new Date(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Normalize a date to local midnight (strip time component)
export function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const timeLeft = (date: string, startTime: string) => {
  // date: "2026-04-10"
  // startTime: "14:30" или "14:30:00"

  const dateTime = new Date(`${date}T${startTime}`);
  const diff = dateTime.getTime() - Date.now();

  if (diff <= 0) return 'Прошло';

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} օրից`;
  }

  if (hours > 0) {
    return `${hours} ժ ${minutes} ր`;
  }

  return `${minutes} ր`;
};