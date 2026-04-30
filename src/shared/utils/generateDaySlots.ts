import {TimeSlot} from "@shared/types/slot";
import React, {useMemo, useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useRoute} from "@react-navigation/core";
import {normalizeDate, toDayKey} from "@shared/utils/date";
import {useGetAvailableDates, useGetBookings} from "@entities/booking/model/booking.model";
import {formatDateYMD} from "@shared/lib/formatDate";

const DAY_START_H = 9;   // 09:00
const DAY_END_H   = 20;  // 20:00
const STEP_MIN    = 30;

function pad(n: number) { return String(n).padStart(2, '0'); }

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 8);
}

export function generateDaySlots(date: string, apiSlots: TimeSlot[], today: string, currentTime: string): TimeSlot[] {
  // Индекс реальных слотов по startTime для быстрого поиск O(1)
  const apiMap = new Map<string, TimeSlot>(
    apiSlots.map(s => [s.startTime, s])
  );

  const result: TimeSlot[] = [];
  let minutes = DAY_START_H * 60;
  const endMinutes = DAY_END_H * 60;

  while (minutes + STEP_MIN <= endMinutes) {
    const startH = Math.floor(minutes / 60);
    const startM = minutes % 60;
    const endH   = Math.floor((minutes + STEP_MIN) / 60);
    const endM   = (minutes + STEP_MIN) % 60;

    const startTime = `${pad(startH)}:${pad(startM)}:00`;
    const endTime   = `${pad(endH)}:${pad(endM)}:00`;

    const existing = apiMap.get(startTime);
    const threshold = new Date(`${date}T${currentTime}`);
    threshold.setMinutes(threshold.getMinutes() + 40);
    const thresholdTime = formatTime(threshold);

    const disabled = date < today
      || (date === today && startTime <= currentTime)
      || (date === today && startTime < thresholdTime);
    const disabledReason = date < today
    || (date === today && startTime <= currentTime)
      ? 'Прошло'
      : 'Мало времени';

    result.push({
      // Если слот есть в API — берём его id и isBooked
      // Иначе — слот свободен (нет в базе = нет записи)
      id:        existing?.id        ?? -(minutes), // отрицательный id = не в базе
      date,
      startTime,
      endTime,
      isBooked: Boolean(existing?.id)  ?? false,
      disabled,
      disabledReason: disabled ? disabledReason : undefined,
      notes:     existing?.notes     ?? null,
      dentistId: existing?.dentistId ?? -1,
      clinicId:  existing?.clinicId  ?? null,
      dentist:   existing?.dentist   ?? null,
      clinic:    existing?.clinic    ?? null,
      createdAt: existing?.createdAt ?? '',
      updatedAt: existing?.updatedAt ?? '',
      duration:  existing?.duration  ?? -1,
      service:   existing?.service   ?? '',
      status:    existing?.status    ?? 'pending',
      patient:existing?.patient
    });

    minutes += STEP_MIN;
  }

  return result;
}