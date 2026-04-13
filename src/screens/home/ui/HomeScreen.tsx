import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {HeaderCard} from "@widgets/header-card/ui/HeaderCard";
import { DoctorList } from "@widgets/doctors-list/ui/DoctorList";
import {  NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabParamList } from "@app/navigation/types";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ──────────────────────────────────────────────────────────────────

interface TimelineDate {
  month: string;
  day: number;
  done: boolean;
  isNext?: boolean;
}

interface Appointment {
  doctorName: string;
  specialty: string;
  procedure: string;
  day: number;
  month: string;
  time: string;
  rating: number;
}

interface HygieneItem {
  icon: string;
  label: string;
  done: boolean;
  detail: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const TIMELINE: TimelineDate[] = [
  { month: 'Март', day: 28, done: true },
  { month: 'Апр',  day: 15, done: true },
  { month: 'Апр',  day: 28, done: true },
  { month: 'Май',  day: 10, done: false, isNext: true },
  { month: 'Июн',  day: 28, done: false },
  { month: 'Июл',  day: 15, done: false },
];

const APPOINTMENT: Appointment = {
  doctorName: 'Саакян Д.',
  specialty: 'Терапевт',
  procedure: 'Ани Саргсян',
  day: 12,
  month: 'НОЯ',
  time: '11:00',
  rating: 4.9,
};

const HYGIENE: HygieneItem[] = [
  { icon: '🪥', label: 'Чистка',    done: true,  detail: '✓ Сегодня' },
  { icon: '💧', label: 'Ополоск.',  done: false, detail: '○ Не выпол.' },
  { icon: '🦷', label: 'До визита', done: false, detail: '8 дней' },
  { icon: '📸', label: 'Снимок',    done: false, detail: '6 мес. назад' },
];

// ─── Palette ─────────────────────────────────────────────────────────────────

const C = {
  // Sky blue primary
  primary:     '#4A9FF5',
  primaryDark: '#2D7DD2',
  primaryLight:'#EFF6FF',
  // Pink accent (NEXT badge / teal date)
  pink:        '#FF4D7D',
  pinkLight:   '#FFE4ED',
  // Teal accent
  teal:        '#4DD9AC',
  tealDark:    '#2BB894',
  tealLight:   '#ECFDF5',
  // Neutrals
  bg:          '#E8F4FF',
  white:       '#FFFFFF',
  text:        '#0F172A',
  textSub:     '#64748B',
  textMuted:   '#94A3B8',
  border:      '#E2E8F0',
  // Misc
  green:       '#22C55E',
};

// ─── Timeline Card ───────────────────────────────────────────────────────────

const TimelineCard: React.FC<{ item: TimelineDate; index: number }> = ({ item, index }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  if (item.isNext) {
    return (
      <Animated.View style={[styles.nextCard, { opacity: anim, transform: [{ scale: anim }] }]}>
        <Text style={styles.nextLabel}>СЛЕД.</Text>
        <Text style={styles.nextSub}>запись</Text>
        <View style={styles.nextDot} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.dateCard, { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
      <Text style={styles.dateMonth}>{item.month}</Text>
      <Text style={[styles.dateDay, !item.done && styles.dateDayMuted]}>{item.day}</Text>
      {item.done
        ? <View style={[styles.dateDot, { backgroundColor: C.teal }]} />
        : <View style={[styles.dateDot, { backgroundColor: C.border }]} />
      }
    </Animated.View>
  );
};

// ─── Multi-Layer Appointment Card ────────────────────────────────────────────

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const slideUp = useRef(new Animated.Value(30)).current;
  const opacity  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUp, { toValue: 0,   duration: 500, delay: 400, useNativeDriver: true }),
      Animated.timing(opacity,  { toValue: 1,   duration: 500, delay: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: slideUp }] }}>
      {/* Layer 3 — back shadow */}
      <View style={styles.cardLayer3} />
      {/* Layer 2 — mid shadow */}
      <View style={styles.cardLayer2} />
      {/* Layer 1 — main card */}
      <View style={styles.cardLayer1}>
        {/* Left: icon + info */}
        <View style={styles.cardIconWrap}>
          <Text style={styles.cardIcon}>🦷</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardSpecialty}>{appointment.specialty}</Text>
          <Text style={styles.cardDoctor}>{appointment.doctorName}</Text>
          <Text style={styles.cardProcedure}>{appointment.procedure}</Text>
          <Text style={styles.cardRating}>★ {appointment.rating}</Text>
        </View>
        {/* Right: teal date + pink NEXT */}
        <View style={styles.cardRight}>
          <View style={styles.cardDateBlock}>
            <Text style={styles.cardDateDay}>{appointment.day}</Text>
            <Text style={styles.cardDateMonth}>{appointment.month}</Text>
            <Text style={styles.cardDateTime}>{appointment.time}</Text>
          </View>
          <View style={styles.cardNextBadge}>
            <Text style={styles.cardNextText}>СЛЕД.</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Connector ───────────────────────────────────────────────────────────────

const Connector: React.FC = () => {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(height, { toValue: 40, duration: 500, delay: 600, useNativeDriver: false }).start();
  }, []);

  return (
    <View style={styles.connectorWrap}>
      <Animated.View style={[styles.connectorLine, { height }]} />
      <View style={styles.connectorDotOuter}>
        <View style={styles.connectorDotInner} />
      </View>
    </View>
  );
};
// ─── HomeScreen ──────────────────────────────────────────────────────────────
interface IProps {
  navigation: NativeStackNavigationProp<TabParamList, 'HomeTab'>;
}

const HomeScreen: React.FC<IProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const headerY = useRef(new Animated.Value(-20)).current;
  const headerO = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerY, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(headerO, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top, opacity: headerO  },
        ]}
      >
      <HeaderCard  insetTop={2} headerY={headerY} headerO={headerO} />
      </Animated.View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Timeline Section ── */}
        <Text style={styles.sectionTitle}>Appointments Timeline</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineRow}
        >
          {TIMELINE.map((item, i) => (
            <TimelineCard key={i} item={item} index={i} />
          ))}
        </ScrollView>
        {/* ── Connector ── */}
        <View style={styles.connectorSection}>
          <Connector />
        </View>

        {/* ── Appointment Details Section ── */}
        <Text style={styles.sectionTitle}>Appointments details</Text>
        <AppointmentCard appointment={APPOINTMENT} />
        {/* ── Dentists Section ── */}
        <Text style={styles.sectionTitle}>Dentists</Text>
        <DoctorList navigation={navigation} horizontal />
      </ScrollView>

    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const CARD_RADIUS = 20;
const SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  android: { elevation: 8 },
});
const SHADOW_SM = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    backgroundColor: C.bg,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 13,
    color: C.textSub,
    marginTop: 2,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_SM,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.white,
  },
  avatarOnline: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.bg,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // ── Section Title ──
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.primary,
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: -0.3,
  },

  // ── Timeline Row ──
  timelineRow: {
    paddingRight: 24,
    gap: 10,
    alignItems: 'center',
    padding: 12,
    paddingLeft: 5,
    paddingBottom: 20
  },

  // ── Date Card ──
  dateCard: {
    width: 56,
    height: 70,
    borderRadius: 16,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...SHADOW_SM,
  },
  dateMonth: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: '500',
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '800',
    color: '#475569',
    lineHeight: 26,
  },
  dateDayMuted: {
    color: C.textMuted,
  },
  dateDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 2,
  },

  // ── NEXT card ──
  nextCard: {
    width: 72,
    height: 70,
    borderRadius: 20,
    backgroundColor: C.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: C.pink,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.40,
        shadowRadius: 14,
      },
      android: { elevation: 10 },
    }),
  },
  nextLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: C.white,
    letterSpacing: 0.5,
  },
  nextSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  nextDot: {
    position: 'absolute',
    bottom: -5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.pink,
  },
  // ── Connector ──
  connectorSection: {
    alignItems: 'center',
    marginVertical: -10,
    height: 20,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  connectorWrap: {
    alignItems: 'center',
  },
  connectorLine: {
    width: 2,
    backgroundColor: C.pink,
    borderRadius: 1,
    opacity: 0.6,
    left: 37,
  },
  connectorDotOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,77,125,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    left: 37
  },
  connectorDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.pink,
  },
  // ── Multi-Layer Appointment Card ──
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
    backgroundColor: C.white,
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
    backgroundColor: C.primaryLight,
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
    fontSize: 11,
    color: C.textMuted,
    fontWeight: '500',
  },
  cardDoctor: {
    fontSize: 15,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },
  cardProcedure: {
    fontSize: 12,
    fontWeight: '600',
    color: C.primary,
  },
  cardRating: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  cardDateBlock: {
    width: 54,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.teal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: C.teal,
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
    color: C.white,
    lineHeight: 20,
  },
  cardDateMonth: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  cardDateTime: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  cardNextBadge: {
    width: 54,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: C.pink,
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
    color: C.white,
    letterSpacing: 0.5,
  },

  // ── Action Buttons ──
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  btnPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.teal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: C.teal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.white,
  },
  btnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSub,
  },

  // ── Hygiene Grid ──
  hygieneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hygieneItem: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    ...SHADOW_SM,
  },
  hygieneIcon: {
    fontSize: 26,
  },
  hygieneLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textSub,
  },
  hygieneDetail: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textMuted,
  },
  hygieneDetailDone: {
    color: C.green,
  },

  // ── XP Bar ──
  xpCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    ...SHADOW_SM,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  xpLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primary,
  },
  xpPct: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textSub,
  },
  xpTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primaryLight,
    overflow: 'hidden',
  },
  xpFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },

  // ── Dots ──
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 14,
    height: 14,
  },
  dotOuter: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // ── Bottom Nav ──
  navBar: {
    flexDirection: 'row',
    backgroundColor: C.white,
    paddingTop: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navIcon: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: C.textMuted,
  },
  navLabelActive: {
    color: C.primary,
    fontWeight: '700',
  },
  navIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.primary,
    marginTop: 1,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
  },
  notifBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifIcon: { fontSize: 17, lineHeight: 22 },
  notifBadge: {
    position: 'absolute',
    top: 4, right: 4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: C.pink,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  notifBadgeText: {
    fontSize: 7, fontWeight: '800', color: '#fff', lineHeight: 10,
  },
  heroMenuBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroMenuText: { fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },

});

export default HomeScreen;
