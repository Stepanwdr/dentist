import {bookingColors as C} from "@shared/theme/Booking.colors";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Animated, StatusBar, TouchableOpacity, View, Text, StyleSheet, Platform, Image} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadow } from "@features/book-slot/lib";
import { BottomSheetDetail } from "@features/book-slot/ui/BottomSheetDetail";
import {TimeSlot} from "@shared/types/slot";
import {CARD_RADIUS, HomeColor, SHADOW} from "@shared/theme/home";
import {BookStatus} from "@shared/ui/BookStatus";

export const SuccessScreen: React.FC<{
  onHome:  () => void;
  handleBooksNavigate: () => void;
  lastBook: TimeSlot | null;
}> = ({  onHome, handleBooksNavigate, lastBook }) => {
  const insets   = useSafeAreaInsets();
  const [sheet, setSheet] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const { startTime, shortMonth, day, isToday } = useMemo(() => {
    if (!lastBook?.startTime) return {};

    const date = new Date(lastBook.date);
    const today = new Date();
    return {
      startTime: lastBook.startTime,
      shortMonth: date.toLocaleString('en', { month: 'short' }), // May
      day: date.getDate(), // 24
      isToday: date.getDate() === today.getDate()
    };
  }, [lastBook]);


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
        <View style={styles.cardLayer1}>
          <View style={styles.cardIconWrap}>
            <Image source={{uri: lastBook?.dentist?.avatar}} style={styles.image}/>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardSpecialty}>{lastBook?.dentist?.speciality}</Text>
            <Text style={styles.cardDoctor}>{lastBook?.dentist?.name}</Text>
            <Text style={styles.cardProcedure}>{lastBook?.service}</Text>
            {/*<Text style={styles.cardRating}>★ {data?.dentist?.rating}</Text>*/}
            <Text style={styles.phone}>{lastBook?.dentist?.phone}</Text>
          </View>
          {/* Right: teal date + pink NEXT */}
          <View style={styles.cardRight}>
            <View style={styles.cardDateBlock}>
              {isToday ? <Text style={styles.cardDateDay}>Сегодня</Text> :
                <><Text style={styles.cardDateDay}>{day}</Text>
                  <Text style={styles.cardDateMonth}>{shortMonth}</Text>
                </>
              }
              <Text style={styles.cardDateTime}>{startTime}</Text>
            </View>
            <BookStatus status={lastBook?.status || 'pending'}/>
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
        booked={lastBook}
        handleBooksNavigate={handleBooksNavigate}
        onClose={()=>setSheet(false)}
        startTime={startTime ||''}
        shortMonth={shortMonth ||''}
        day={String(day)}
        isToday={isToday}
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

    cardLayer3: {
      position: 'absolute',
      top: 14,
      left: 12,
      right: 12,
      height: 80,
      borderRadius: CARD_RADIUS,
      backgroundColor: '#D6E8FA',
      opacity: 0.7,
    },
    image:{
      width: '100%',
      height: 48,
      borderRadius: 14,
      marginBottom: 8,
    },
    cardLayer2: {
      position: 'absolute',
      top: 8,
      left: 6,
      right: 6,
      height: 82,
      borderRadius: CARD_RADIUS,
      backgroundColor: '#C0D8F2',
      opacity: 0.8,
    },
    cardLayer1: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: HomeColor.white,
      borderRadius: CARD_RADIUS,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 6,
      ...SHADOW,
    },
    cardIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: HomeColor.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    cardIcon: {
      fontSize: 22,
    },
    cardInfo: {
      flex: 1,
      gap: 2,
    },
    cardSpecialty: {
      fontSize: 12,
      color: HomeColor.textMuted,
      fontWeight: '500',
    },
    cardDoctor: {
      fontSize: 15,
      fontWeight: '800',
      color: HomeColor.text,
      letterSpacing: -0.3,
    },
    cardProcedure: {
      fontSize: 14,
      fontWeight: '600',
      color: HomeColor.primary,
      marginBottom: 5
    },
    phone: {
      fontSize: 12,
      fontWeight: '600',
      color: HomeColor.textSub,
      textAlign: 'left',
      left:-5
    },
    cardRating: {
      fontSize: 11,
      color: HomeColor.textMuted,
      marginTop: 2,
    },
    cardRight: {
      alignItems: 'center',
      gap: 6,
      marginLeft: 8,
    },
    cardDateBlock: {
      width: 70,
      height: 52,
      borderRadius: 14,
      backgroundColor: HomeColor.teal,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: HomeColor.teal,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        },
        android: { elevation: 7 },
      }),
    },
    cardDateDay: {
      fontSize: 18,
      fontWeight: '900',
      color: HomeColor.white,
      lineHeight: 20,
    },
    cardDateMonth: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '600',
    },
    cardDateTime: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 1,
    },
    cardNextBadge: {
      width: 54,
      height: 22,
      borderRadius: 11,
      backgroundColor: HomeColor.pink,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: HomeColor.pink,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
        },
        android: { elevation: 5 },
      }),
    },
    cardNextText: {
      fontSize: 10,
      fontWeight: '800',
      color: HomeColor.white,
      letterSpacing: 0.5,
    },
});
