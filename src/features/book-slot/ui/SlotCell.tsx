import React, {memo, useCallback,  useRef} from "react";
import {Animated, TouchableOpacity, View,Text,StyleSheet, Dimensions, Platform} from "react-native";

export const SlotCell = memo<{
  slot: TimeSlot; selected: boolean; onPress: (s: TimeSlot) => void;
}>(({ slot, selected, onPress }) => {
    const sc = useRef(new Animated.Value(1)).current;
    const press = useCallback(() => {
      if (slot.isBooked) return;
      Animated.sequence([
        Animated.timing(sc, { toValue: 0.92, duration: 65, useNativeDriver: true }),
        Animated.spring(sc, { toValue: 1, useNativeDriver: true, tension: 220, friction: 10 }),
      ]).start();
      onPress(slot);
    }, [slot, onPress]);
    return (
      <TouchableOpacity onPress={press} activeOpacity={0.8} disabled={slot.isBooked} style={{ width: SLOT_W }}>
        <Animated.View style={[
          S.slot,
          selected    && S.slotSel,
          slot.isBooked && S.slotBooked,
          { transform: [{ scale: sc }] },
        ]}>
          <View style={[S.radio, selected && S.radioSel, slot.isBooked && S.radioDis]}>
            {selected && <View style={S.radioDot} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[S.slotTime, selected && S.slotTimeSel, slot.isBooked && S.slotTimeDis]}>
              {slot.startTime} – {slot.endTime}
            </Text>
            <Text style={[S.slotDur, selected && S.slotDurSel, slot.isBooked && S.slotDurDis]}>
              {slot.isBooked ? 'Занято' : `30 мин`}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  },
  (p, n) => p.selected === n.selected && p.slot.isBooked === n.slot.isBooked);


import { bookingColors as C } from '@shared/theme/Booking.colors';
import {TimeSlot} from "@shared/types/slot";
import {SLOT_W} from "@features/book-slot/lib";

const { width: SW } = Dimensions.get('window');

const shadow = (color = '#000', op = 0.12, r = 10, y = 4) =>
  Platform.select({
    ios:     { shadowColor: color, shadowOffset: { width: 0, height: y }, shadowOpacity: op, shadowRadius: r },
    android: { elevation: Math.max(2, Math.round(r * 0.55)) },
  }) ?? {};

// Экспортируем SLOT_W — используется в TouchableOpacity style={{ width: SLOT_W }}

export const S = StyleSheet.create({
  // ── Карточка слота ──
  slot: {
    width: SLOT_W,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 13,
    gap: 10,
  },
  slotSel:    { backgroundColor: C.skyTop, borderColor: C.skyTop, ...shadow(C.skyTop, 0.35, 12, 5) },
  slotBooked: { backgroundColor: '#F1F5F9', borderColor: 'transparent', opacity: 0.6 },

  // ── Радио-кнопка ──
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSel: { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.25)' },
  radioDis: { borderColor: '#CBD5E1' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },

  // ── Время ──
  slotTime:    { fontSize: 12, fontWeight: '600', color: C.textSub },
  slotTimeSel: { color: '#fff', fontWeight: '700' },
  slotTimeDis: { color: '#94A3B8' },

  // ── Длительность / "Занято" ──
  slotDur:    { fontSize: 10, color: C.textMuted, marginTop: 2 },
  slotDurSel: { color: 'rgba(255,255,255,0.7)' },
  slotDurDis: { color: '#CBD5E1' },
});