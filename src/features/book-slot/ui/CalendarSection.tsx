import {memo, useCallback, useEffect, useMemo, useRef} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import { DayChip } from "./DayChip";
import {DAY_G, DAY_W} from "@features/book-slot/lib";
import { bookingColors as C } from '@shared/theme/Booking.colors';
import { MonthYearPills } from "./MonthYearPills";
import { toDayKey, normalizeDate } from '@shared/utils/date';
const isSameDay = (a: Date, b: Date) => toDayKey(a) === toDayKey(b);

function monthDates(y: number, m: number): Date[] {
  const n = new Date(y, m + 1, 0).getDate();
  return Array.from({ length: n }, (_, i) => new Date(y, m, i + 1));
}
// Local-day helpers moved to date.ts


export const CalendarSection = memo<{
  selectedDate:  Date;
  available:     Set<string>;
  onDateChange:  (d: Date) => void;
  minYear:       number;
  maxYear:       number;
}>(({ selectedDate, available, onDateChange, minYear, maxYear }) => {
    const today   = useMemo(() => normalizeDate(new Date()), []);
    const scrollRef = useRef<ScrollView>(null);
    const selKey    = toDayKey(selectedDate);

    const days = useMemo(
      () => monthDates(selectedDate.getFullYear(), selectedDate.getMonth()),
      [selectedDate.getFullYear(), selectedDate.getMonth()],
    );

    // Скролл к выбранному дню
    useEffect(() => {
      const idx = days.findIndex(d => isSameDay(d, selectedDate));
      if (idx < 0) return;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, idx - 1) * (DAY_W + DAY_G), animated: true });
      }, 80);
    }, [selKey]);

    const handleMonthChange = useCallback((month: number) => {
      const y = selectedDate.getFullYear();
      onDateChange(new Date(y, month, 1)); // 👈 всегда 1 число
    }, [selectedDate, onDateChange]);

    const handleYearChange = useCallback((year: number) => {
      const m = selectedDate.getMonth();
      const maxDay = new Date(year, m + 1, 0).getDate();
      onDateChange(new Date(year, m, Math.min(selectedDate.getDate(), maxDay)));
    }, [selectedDate, onDateChange]);

    useEffect(() => {
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    }, [selectedDate.getMonth(), selectedDate.getFullYear()]);
    const prevMonthRef = useRef(selectedDate.getMonth());

    useEffect(() => {
      const isMonthChanged = prevMonthRef.current !== selectedDate.getMonth();
      prevMonthRef.current = selectedDate.getMonth();

      if (isMonthChanged) return; // 👈 не скроллим при смене месяца

      const idx = days.findIndex(d => isSameDay(d, selectedDate));
      if (idx < 0) return;

      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: Math.max(0, idx - 1) * (DAY_W + DAY_G),
          animated: true,
        });
      }, 80);
    }, [selKey]);
    return (
      <View style={S.calSection}>
        <MonthYearPills
          date={selectedDate}
          minYear={minYear}
          maxYear={maxYear}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />

        {/* ✅ ScrollView горизонтальный — не VirtualizedList, нет конфликта */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.daysRow}
          decelerationRate="fast"
          snapToInterval={DAY_W + DAY_G}
          // key при смене месяца — сбрасываем скролл к началу
          key={`${selectedDate.getFullYear()}-${selectedDate.getMonth()}`}
        >
          {days.map(d => {
      const key  = toDayKey(d);
      const past = toDayKey(d) < toDayKey(today);
            return (
              <DayChip
                key={key}
                date={d}
                selected={key === selKey}
                hasDot={available.size > 0 ? available.has(key) : !past}
                disabled={past}
                onPress={onDateChange}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  },
// ✅ CalendarSection перерендеривается ТОЛЬКО при смене даты или доступных дат
  (p, n) =>
    p.selectedDate.getFullYear() === n.selectedDate.getFullYear() &&
    p.selectedDate.getMonth()    === n.selectedDate.getMonth()    &&
    p.selectedDate.getDate()     === n.selectedDate.getDate()     &&
    p.available                  === n.available
);

const S = StyleSheet.create({
  calSection: {
    backgroundColor: C.white,
    paddingBottom: 4,
    borderRadius:24
  },
  daysRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    gap: DAY_G,
  },
})
