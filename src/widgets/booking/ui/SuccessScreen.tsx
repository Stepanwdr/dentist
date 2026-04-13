import {bookingColors as C} from "@shared/theme/Booking.colors";
import React, {useEffect, useRef, useState} from "react";
import {Animated,  StatusBar,  TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SERVICES } from "@entities/service";
import { shadow } from "@features/book-slot/lib";
import { WEEK } from "@entities/service/model/mockData";
import { BottomSheetDetail } from "@features/book-slot/ui/BottomSheetDetail";

export const SuccessScreen: React.FC<{
  service: typeof SERVICES[0];
  time:    string;
  day:     typeof WEEK[0];
  onHome:  () => void;
  dentistId: string
}> = ({ service, time, day, onHome }) => {
  const insets   = useSafeAreaInsets();
  const [sheet, setSheet] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, useNativeDriver: true,
        tension: 55, friction: 7, delay: 200,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500, delay: 100, useNativeDriver: true,
      }),
    ]).start();

    // Auto-open sheet after 800ms
    const t = setTimeout(() => setSheet(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.skyTop} translucent />
      {/* Hero */}
      <View style={[styles.hero3, { paddingTop: insets.top + 12 }]}>
        <View style={styles.heroOrb1} />
        <TouchableOpacity onPress={onHome} style={styles.backBtnWhite} activeOpacity={0.7}>
          <Text style={[styles.backTxt, { color: '#fff' }]}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.hero3Header}>Запись создана</Text>

        {/* Checkmark animation */}
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.checkInner}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </Animated.View>
        <Animated.Text style={[styles.hero3Sub, { opacity: fadeAnim }]}>
          <Text>Успешно записан!</Text>
        </Animated.Text>
        <View style={{ height: 40 }} />
      </View>

      {/* Body */}
      <Animated.View style={[styles.successBody, { opacity: fadeAnim }]}>
        {/* Appointment card */}
        <View style={styles.successCard}>
          <View>
            <Text style={styles.successCardLabel}>Ваша запись</Text>
            <Text style={styles.successCardDate}>{day.day} {day.num} · {time.split('–')[0].trim()}</Text>
            <Text style={styles.successCardInfo}>Георгий Р. · {service.label}</Text>
          </View>
          <View style={styles.successDateBox}>
            <Text style={styles.successDateNum}>{day.num}</Text>
            <Text style={styles.successDateMon}>июл</Text>
          </View>
        </View>

        {/*/!* Quick actions *!/*/}
        {/*<View style={styles.quickRow}>*/}
        {/*  <TouchableOpacity style={styles.quickBtn} activeOpacity={0.8}>*/}
        {/*    <Text style={styles.quickTxt}>📅 Календарь</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*  <TouchableOpacity style={styles.quickBtn} activeOpacity={0.8}>*/}
        {/*    <Text style={styles.quickTxt}>📱 QR-код</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}

        {/* Open sheet button */}
        <TouchableOpacity
          style={[styles.ctaBtn, { marginTop: 12 }]}
          onPress={() => setSheet(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaTxt}>Детали записи →</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Sheet */}
      <BottomSheetDetail
        visible={sheet}
        service={service}
        time={time}
        day={day}
        onClose={() => setSheet(false)}
      />
    </View>
  );
};


export const styles = StyleSheet.create({
  // ── Контейнер ──
  screen: { flex: 1, backgroundColor: C.bg },

  // ── Hero (синий блок сверху) ──
  hero3: {
    backgroundColor: C.skyTop,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  heroOrb1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -30, right: -40,
  },
  hero3Header: {
    fontSize: 16, fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', marginBottom: 20,
  },
  hero3Sub: {
    textAlign: 'center', fontSize: 13,
    color: 'rgba(255,255,255,0.75)', marginTop: 12,
  },

  // ── Кнопка «назад» в hero ──
  backBtnWhite: { marginBottom: 8 },
  backTxt:      { fontSize: 22, lineHeight: 26 },

  // ── Анимированная галочка ──
  checkCircle: {
    alignSelf: 'center',
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkInner: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 30, color: C.skyTop, fontWeight: '900' },

  // ── Тело экрана ──
  successBody: {
    flex: 1, paddingHorizontal: 16, paddingTop: 20,
  },

  // ── Карточка записи ──
  successCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.white, borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 16, marginBottom: 14,
    ...shadow('#000', 0.09, 14, 5),
  },
  successCardLabel: { fontSize: 11, color: C.textMuted, marginBottom: 4 },
  successCardDate:  { fontSize: 17, fontWeight: '900', color: C.text, letterSpacing: -0.3 },
  successCardInfo:  { fontSize: 12, color: C.skyTop, marginTop: 4 },

  // ── Блок с датой справа ──
  successDateBox: {
    marginLeft: 'auto',
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.4, 12, 5),
  },
  successDateNum: { fontSize: 22, fontWeight: '900', color: '#fff', lineHeight: 24 },
  successDateMon: { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  // ── Быстрые действия (Календарь / QR) ──
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  quickBtn: {
    flex: 1, height: 46, borderRadius: 16,
    backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: C.border,
    ...shadow('#000', 0.05, 8, 2),
  },
  quickTxt: { fontSize: 13, fontWeight: '600', color: C.textSub },

  // ── CTA «Детали записи» ──
  ctaBtn: {
    height: 54, borderRadius: 27,
    backgroundColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.38, 16, 7),
  },
  ctaTxt: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});
