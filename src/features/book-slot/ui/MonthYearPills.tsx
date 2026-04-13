import React, {memo, useCallback, useMemo,useState} from "react";
import { TouchableOpacity, View,Text} from "react-native";

const MONTHS_FULL  = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_SHORT = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];

export const MonthYearPills = memo<{
  date: Date; minYear: number; maxYear: number;
  onMonthChange: (m: number) => void;
  onYearChange:  (y: number) => void;
}>(({ date, minYear, maxYear, onMonthChange, onYearChange }) => {
  const [showM, setShowM] = useState(false);
  const [showY, setShowY] = useState(false);
  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear],
  );
  const m = date.getMonth();
  const y = date.getFullYear();

  const goPrev = useCallback(() => {
    const d = new Date(y, m - 1, 1);
    onMonthChange(d.getMonth()); onYearChange(d.getFullYear());
  }, [y, m, onMonthChange, onYearChange]);

  const goNext = useCallback(() => {
    const d = new Date(y, m + 1, 1);
    onMonthChange(d.getMonth()); onYearChange(d.getFullYear());
  }, [y, m, onMonthChange, onYearChange]);

  return (
    <View>
      <View style={S.pillRow}>
        <TouchableOpacity style={[S.pill, showM && S.pillOn]}
                          onPress={() => { setShowM(v => !v); setShowY(false); }} activeOpacity={0.8}>
          <Text style={[S.pillTxt, showM && S.pillTxtOn]}>{MONTHS_FULL[m]}</Text>
          <Text style={[S.pillChev, showM && S.pillChevOn]}>{showM ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[S.pill, showY && S.pillOn]}
                          onPress={() => { setShowY(v => !v); setShowM(false); }} activeOpacity={0.8}>
          <Text style={[S.pillTxt, showY && S.pillTxtOn]}>{y}</Text>
          <Text style={[S.pillChev, showY && S.pillChevOn]}>{showY ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>

      {showM && (
        <View style={S.drop}>
          <View style={S.dropGrid}>
            {MONTHS_SHORT.map((mn, i) => (
              <TouchableOpacity key={mn}
                                style={[S.dropItem, i === m && S.dropItemOn]}
                                onPress={() => { onMonthChange(i); setShowM(false); }}
                                activeOpacity={0.8}>
                <Text style={[S.dropTxt, i === m && S.dropTxtOn]}>{mn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {showY && (
        <View style={S.drop}>
          <View style={S.dropGrid}>
            {years.map(yr => (
              <TouchableOpacity key={yr}
                                style={[S.dropItem, yr === y && S.dropItemOn]}
                                onPress={() => { onYearChange(yr); setShowY(false); }}
                                activeOpacity={0.8}>
                <Text style={[S.dropTxt, yr === y && S.dropTxtOn]}>{yr}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
});

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { bookingColors as C } from '@shared/theme/Booking.colors';

const { width: SW } = Dimensions.get('window');

const shadow = (color = '#000', op = 0.12, r = 10, y = 4) =>
  Platform.select({
    ios:     { shadowColor: color, shadowOffset: { width: 0, height: y }, shadowOpacity: op, shadowRadius: r },
    android: { elevation: Math.max(2, Math.round(r * 0.55)) },
  }) ?? {};

export const S = StyleSheet.create({
  // ── Строка с пиллами и стрелками ──
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 8,
  },

  // ── Пилл (Январь ▼ / 2026 ▼) ──
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  pillOn:     { backgroundColor: C.skyTop, borderColor: C.skyTop },
  pillTxt:    { fontSize: 14, fontWeight: '700', color: C.text },
  pillTxtOn:  { color: '#fff' },
  pillChev:   { fontSize: 9, color: C.textMuted },
  pillChevOn: { color: 'rgba(255,255,255,0.8)' },

  // ── Кнопки ‹ › ──
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowTxt: { fontSize: 18, color: C.textSub, lineHeight: 22 },

  // ── Дропдаун ──
  drop: {
    marginHorizontal: 16,
    marginBottom: 4,
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.border,
    zIndex: 100,
    ...shadow('#000', 0.12, 20, 8),
  },
  dropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 6,
  },
  dropItem: {
    // 4 колонки с учётом padding и gap
    width: (SW - 32 - 20 - 18) / 4,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: C.bg,
  },
  dropItemOn: { backgroundColor: C.skyTop },
  dropTxt:    { fontSize: 12, fontWeight: '600', color: C.textSub },
  dropTxtOn:  { color: '#fff', fontWeight: '800' },
});