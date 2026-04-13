import React, {useEffect, useRef, useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Animated, ScrollView, StatusBar, Text, TouchableOpacity, View,StyleSheet} from "react-native";
import {bookingColors as C} from "@shared/theme/Booking.colors";

import { SERVICES } from "@entities/service";
import {shadow} from "@features/book-slot/lib";

export const ServiceScreen: React.FC<{ onNext: (s: typeof SERVICES[0]) => void }> = ({ onNext }) => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(SERVICES[0].id);
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? SERVICES : SERVICES.slice(0, 3);

  const heroO = useRef(new Animated.Value(0)).current;
  const heroY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroO, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(heroY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 9 }),
    ]).start();
  }, []);

  const selectedService = SERVICES.find(s => s.id === selected)!;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.skyTop} translucent />

      {/* Hero — swap to LinearGradient */}
      <View style={[styles.hero1, { paddingTop: insets.top + 12 }]}>
        <View style={styles.heroOrb1} />
        <View style={styles.heroOrb2} />
        <Animated.View style={{ opacity: heroO, transform: [{ translateY: heroY }] }}>
          <Text style={styles.heroTitle}>Записаться на приём</Text>
        </Animated.View>
        {/* Tooth illustrations (placeholder circles) */}
        <View style={styles.toothWrap}>
          <View style={[styles.tooth, styles.tooth1]} />
          <View style={[styles.tooth, styles.tooth2]} />
          <View style={[styles.tooth, styles.tooth3]} />
        </View>
        <View style={{ height: 40 }} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor card */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorAccent} />
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorInitials}>ДГ</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Дк. Давид Саакян</Text>
          </View>
          <TouchableOpacity style={styles.doctorArrow} activeOpacity={0.8}>
            <Text style={styles.doctorArrowTxt}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Service selector */}
        <Text style={styles.sectionLabel}>Выберите услугу</Text>
        {displayed.map((s) => {
          const isSelected = s.id === selected;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.serviceRow, isSelected && styles.serviceRowSelected]}
              onPress={() => setSelected(s.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <Text style={[styles.serviceLabel, isSelected && styles.serviceLabelSelected]}>
                {s.icon} {s.label}
              </Text>
              <Text style={[styles.servicePrice, isSelected && { color: C.skyTop }]}>
                {s.price}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Show all toggle */}
        <TouchableOpacity
          style={styles.showAllBtn}
          onPress={() => setShowAll(v => !v)}
          activeOpacity={0.8}
        >
          <Text style={styles.showAllTxt}>
            {showAll ? 'Скрыть ▲' : 'Показать все ▼'}
          </Text>
        </TouchableOpacity>

        {/* Next CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => onNext(selectedService)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaTxt}>Продолжить →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


export const styles = StyleSheet.create({
  // ── Контейнер ──
  screen: { flex: 1, backgroundColor: C.bg },

  // ── Hero ──
  hero1: {
    backgroundColor: C.skyTop,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  heroOrb1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -30, right: -40,
  },
  heroOrb2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)', top: 120, left: -20,
  },
  heroTitle:    { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },

  // ── Зубы (placeholder) ──
  toothWrap: {
    flexDirection: 'row', alignItems: 'flex-end',
    marginTop: 20, gap: 12, height: 100,
  },
  tooth:  { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 20 },
  tooth1: { width: 52, height: 76, transform: [{ rotate: '-15deg' }] },
  tooth2: { width: 44, height: 68, transform: [{ rotate: '12deg' }],  bottom: -6 },
  tooth3: { width: 34, height: 54, transform: [{ rotate: '-8deg' }],  bottom: -10 },

  // ── ScrollView ──
  body:        { flex: 1 },
  bodyContent: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 120 },

  // ── Карточка врача ──
  doctorCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.white, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 14,
    marginBottom: 22, overflow: 'hidden',
    ...shadow('#000', 0.08, 14, 4),
  },
  doctorAccent: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 4, backgroundColor: C.skyTop,
  },
  doctorAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  doctorInitials: { fontSize: 14, fontWeight: '800', color: C.skyBot },
  doctorInfo:     { flex: 1 },
  doctorName:     { fontSize: 14, fontWeight: '800', color: C.text, letterSpacing: -0.2 },
  doctorArrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.35, 8, 3),
  },
  doctorArrowTxt: { fontSize: 18, color: '#fff', lineHeight: 22 },

  // ── Список услуг ──
  sectionLabel: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 12 },
  serviceRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.white, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 10, borderWidth: 1.5, borderColor: C.border,
    ...shadow('#000', 0.05, 8, 2),
  },
  serviceRowSelected:   { backgroundColor: C.selected, borderColor: C.skyTop },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  radioSelected:        { borderColor: C.skyTop, backgroundColor: C.skyTop },
  radioDot:             { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  serviceLabel:         { flex: 1, fontSize: 14, color: C.text, fontWeight: '500' },
  serviceLabelSelected: { color: C.text, fontWeight: '700' },
  servicePrice:         { fontSize: 14, fontWeight: '700', color: C.textSub },

  // ── Показать все ──
  showAllBtn: {
    alignItems: 'center', paddingVertical: 14,
    backgroundColor: '#EFF6FF', borderRadius: 16,
    borderWidth: 1.5, borderColor: '#BFDBFE',
    marginTop: 4, marginBottom: 16,
  },
  showAllTxt: { fontSize: 13, fontWeight: '600', color: C.skyTop },

  // ── CTA ──
  ctaBtn: {
    height: 54, borderRadius: 27,
    backgroundColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.38, 16, 7),
  },
  ctaTxt: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});