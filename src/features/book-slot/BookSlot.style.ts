import { StyleSheet } from 'react-native';
import { bookingColors as C } from '@shared/theme/Booking.colors';
import {shadow} from "@features/book-slot/lib";


export const bookSlotStyle = StyleSheet.create({
  // ── Корневой контейнер ──
  screen:  { flex: 1, backgroundColor: C.white },
  content: { paddingHorizontal: 16, gap: 10,minHeight: '108%'},

  // ── Шапка (‹ Заголовок) ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: C.white,
  },
  topTitle: { fontSize: 24, fontWeight: '800', color: C.text, letterSpacing: -0.3, textAlign:'left' },
  backBtn:  { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt:  { fontSize: 24, color: C.text, lineHeight: 28 },

  // ── Шапка слотов "Время · N свободно" ──
  slotsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 4,
  },
  slotsTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  badge:      {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: C.skyLight,
  },
  badgeTxt: { fontSize: 11, fontWeight: '600', color: C.skyTop },

  // ── Ряд из двух слотов ──
  slotRow: { flexDirection: 'row', gap: 10 },

  // ── Loading / Empty ──
  center: {
    paddingVertical: 52,
    alignItems: 'center',
    gap: 10,
  },
  loadTxt:    { fontSize: 13, color: C.textMuted },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  emptyTxt:   { fontSize: 13, color: C.textMuted },

  // ── Прогресс-бар (TimeScreen) ──
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: C.white,
    gap: 10,
  },
  progressTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.border },
  progressFill:  { height: 4, borderRadius: 2, backgroundColor: C.skyTop },
  stepLabel:     { fontSize: 11, color: C.textMuted, minWidth: 56, textAlign: 'right' },

  // ── CTA ──
  timeCTAWrap: {
    position: 'absolute', bottom: 62, left: 20, right: 20,
    ...shadow(C.skyTop, 0.2, 20, 0),
  },
  ctaBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: C.skyTop,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(C.skyTop, 0.38, 16, 7),
  },
  ctaBtnDisabled: { backgroundColor: '#B0C4D8', ...shadow('#000', 0.06, 8, 3) },
  ctaTxt: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});

// Алиас для краткости — используется как S в компоненте
export const S = bookSlotStyle;