import React, {memo, useCallback, useMemo, useRef} from "react";
import {Animated, Text, TouchableOpacity, View,StyleSheet} from "react-native";
import { bookingColors as C } from '@shared/theme/Booking.colors';
import {DAY_W, DAYS_SHORT, shadow} from "@features/book-slot/lib";
import { toDayKey, normalizeDate } from '@shared/utils/date';

export const DayChip = memo<{
  date: Date; selected: boolean; hasDot: boolean;
  disabled: boolean; onPress: (d: Date) => void;
}>(({ date, selected, hasDot, disabled, onPress }) => {
  const sc    = useRef(new Animated.Value(1)).current;
  const todayKey = useMemo(() => toDayKey(new Date()), []);
  const isToday = toDayKey(date) === todayKey;

  const press = useCallback(() => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(sc, { toValue: 0.86, duration: 70, useNativeDriver: true }),
      Animated.spring(sc, { toValue: 1, useNativeDriver: true, tension: 220, friction: 10 }),
    ]).start();
    onPress(normalizeDate(date));
  }, [disabled, date, onPress]);

  return (
    <TouchableOpacity onPress={press} activeOpacity={0.75} disabled={disabled}>
      <Animated.View style={[
        S.chip,
        selected          && S.chipSel,
        isToday && !selected && S.chipToday,
        disabled          && S.chipDis,
        { transform: [{ scale: sc }] },
      ]}>
        <Text style={[S.chipDay, selected && S.chipDaySel, isToday && !selected && S.chipDayToday, disabled && S.chipDayDis]}>
          {DAYS_SHORT[date.getDay()]}
        </Text>
        <Text style={[S.chipNum, selected && S.chipNumSel, isToday && !selected && S.chipNumToday, disabled && S.chipNumDis]}>
          {date.getDate()}
        </Text>
        <View style={S.dotWrap}>
          {hasDot && !disabled
            ? <View style={[S.dot, selected ? S.dotSel : S.dotOn]} />
            : <View style={S.dotOff} />}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
},  (p, n) => p.selected === n.selected && p.hasDot === n.hasDot && p.disabled === n.disabled);

 const S = StyleSheet.create({
  // ── Ячейка дня ──
  chip: {
    width: DAY_W,
    height: 76,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingVertical: 8,
    gap: 3,
  },
  chipSel:   { backgroundColor: C.skyTop, borderColor: C.skyTop, ...shadow(C.skyTop, 0.38, 12, 5) },
  chipToday: { borderColor: C.skyTop, backgroundColor: C.skyLight },
  chipDis:   { backgroundColor: '#F8FAFF', opacity: 0.45 },

  // ── Название дня (Пн, Вт...) ──
  chipDay:      { fontSize: 10, fontWeight: '500', color: C.textMuted },
  chipDaySel:   { color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  chipDayToday: { color: C.skyTop, fontWeight: '700' },
  chipDayDis:   { color: '#CBD5E1' },

  // ── Число дня ──
  chipNum:      { fontSize: 20, fontWeight: '800', color: C.textSub, lineHeight: 24 },
  chipNumSel:   { color: '#fff', fontWeight: '900' },
  chipNumToday: { color: C.skyTop, fontWeight: '900' },
  chipNumDis:   { color: '#CBD5E1' },

  // ── Точка-индикатор ──
  dotWrap: { height: 6, justifyContent: 'center', alignItems: 'center' },
  dot:     { width: 5, height: 5, borderRadius: 3 },
  dotOn:   { backgroundColor: C.teal },
  dotSel:  { backgroundColor: 'rgba(255,255,255,0.8)' },
  dotOff:  { width: 5, height: 5 }, // placeholder — высота не прыгает
});
