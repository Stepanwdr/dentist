import { ScheduleBlock } from "@entities/schedule-block";
import { TimeSlot } from "@shared/types/slot";

const DAY_START_H = 9;
const DAY_END_H = 20;
const STEP_MIN = 60;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 8);
}

export function generateDaySlots(
  date: string,
  apiSlots: TimeSlot[],
  today: string,
  currentTime: string,
  blocks: ScheduleBlock[] = [],
): TimeSlot[] {
  const apiMap = new Map<string, TimeSlot>(
    apiSlots.map((slot) => [slot.startTime, slot]),
  );

  const result: TimeSlot[] = [];
  let minutes = DAY_START_H * 60;
  const endMinutes = DAY_END_H * 60;

  while (minutes + STEP_MIN <= endMinutes) {
    const startH = Math.floor(minutes / 60);
    const startM = minutes % 60;
    const endH = Math.floor((minutes + STEP_MIN) / 60);
    const endM = (minutes + STEP_MIN) % 60;

    const startTime = `${pad(startH)}:${pad(startM)}:00`;
    const endTime = `${pad(endH)}:${pad(endM)}:00`;

    const existing = apiMap.get(startTime);
    const block = blocks.find((item) =>
      item.startTime < endTime && item.endTime > startTime,
    );

    const threshold = new Date(`${date}T${currentTime}`);
    threshold.setMinutes(threshold.getMinutes() + 40);
    const thresholdTime = formatTime(threshold);

    const disabledByTime =
      date < today ||
      (date === today && startTime <= currentTime) ||
      (date === today && startTime < thresholdTime);

    const disabled = disabledByTime || Boolean(block);
    const disabledReason = block
      ? block.reason || 'Blocked'
      : date < today || (date === today && startTime <= currentTime)
        ? 'РџСЂРѕС€Р»Рѕ'
        : 'РњР°Р»Рѕ РІСЂРµРјРµРЅРё';

    result.push({
      id: existing?.id ?? -minutes,
      date,
      startTime,
      endTime,
      isBooked: Boolean(existing?.id) || Boolean(block),
      disabled,
      disabledReason: disabled ? disabledReason : undefined,
      notes: existing?.notes ?? block?.reason ?? null,
      dentistId: existing?.dentistId ?? -1,
      clinicId: existing?.clinicId ?? null,
      dentist: existing?.dentist ?? null,
      clinic: existing?.clinic ?? null,
      createdAt: existing?.createdAt ?? '',
      updatedAt: existing?.updatedAt ?? '',
      duration: existing?.duration ?? -1,
      service: existing?.service ?? '',
      status: existing?.status ?? 'pending',
      patient: existing?.patient,
    });

    minutes += STEP_MIN;
  }

  return result;
}
