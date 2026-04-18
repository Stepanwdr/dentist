import React, { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/theme/colors";
import {useAuth} from "@features/auth/model/useAuth";
import {useMeQuery} from "@shared/api";

const { width: SW } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// PALETTE  (OP — Sky Blue Timeline)
// ─────────────────────────────────────────────────────────────
const C = {
  // Sky blue gradient
  skyTop:    '#4A9FF5',
  skyBot:    '#2D7DD2',
  skyLayer2: '#5BAEF7',   // mid layer
  skyLayer3: '#6BBCF9',   // deep layer
  // Accents
  teal:      '#4DD9AC',
  tealGlow:  'rgba(77,217,172,0.40)',
  pink:      '#FF4D7D',
  pinkGlow:  'rgba(255,77,125,0.40)',
  green:     '#22C55E',
  // Text on card
  cardText:  '#FFFFFF',
  cardSub:   'rgba(255,255,255,0.65)',
  cardMuted: 'rgba(255,255,255,0.42)',
  cardFill:  'rgba(255,255,255,0.13)',
  cardBorder:'rgba(255,255,255,0.18)',
  cardIcon:  'rgba(255,255,255,0.20)',
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const mkShadow = (color = '#000', op = 0.14, r = 16, y = 6) =>
  Platform.select({
    ios:     { shadowColor: color, shadowOffset: { width: 0, height: y }, shadowOpacity: op, shadowRadius: r },
    android: { elevation: Math.max(2, Math.round(r * 0.55)) },
  }) ?? {};

// ─────────────────────────────────────────────────────────────
// SLIDE DATA
// ─────────────────────────────────────────────────────────────
interface SlideData {
  icon:     string;
  label:    string;
  title:    string;
  subtitle: string;
  detail:   string;
  badgeText:  string;
  badgeColor: string;
}

const SLIDES: SlideData[] = [
  {
    icon:       '🦷',
    label:      'Следующий визит',
    title:      '12 ноября · 10:00',
    subtitle:   'Иванова М.С.',
    detail:     'Терапевт · через 8 дней',
    badgeText:  'СЛЕД.',
    badgeColor: C.pink,
  },
  {
    icon:       '💊',
    label:      'Витамины · Омега-3',
    title:      'Приём через 2 часа',
    subtitle:   'Не забудьте принять',
    detail:     '850 XP · Серебро 🏆',
    badgeText:  'СЕЙЧАС',
    badgeColor: '#6366F1',
  },
  {
    icon:       '🪥',
    label:      'Гигиена сегодня',
    title:      'Чистка: ✓ выполнена',
    subtitle:   'Ополаскиватель: ○',
    detail:     '8 дней до снимка',
    badgeText:  '75%',
    badgeColor: C.teal,
  },
];

// ─────────────────────────────────────────────────────────────
// SLIDE ITEM
// ─────────────────────────────────────────────────────────────
const SlideItem: React.FC<{ item: SlideData; slideW: number }> = ({ item, slideW }) => (
  <View style={[styles.slideItem, { width: slideW }]}>
    {/* icon box */}
    <View style={styles.slideIconBox}>
      <Text style={styles.slideIconEmoji}>{item.icon}</Text>
    </View>

    {/* text */}
    <View style={styles.slideInfo}>
      <Text style={styles.slideLabel}  numberOfLines={1}>{item.label}</Text>
      <Text style={styles.slideTitle}  numberOfLines={1}>{item.title}</Text>
      <Text style={styles.slideSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      <Text style={styles.slideDetail} numberOfLines={1}>{item.detail}</Text>
    </View>

    {/* badge */}
    <View style={[
      styles.slideBadge,
      { backgroundColor: item.badgeColor },
      mkShadow(item.badgeColor, 0.45, 10, 4),
    ]}>
      <Text style={styles.slideBadgeText}>{item.badgeText}</Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────
// DOTS
// ─────────────────────────────────────────────────────────────
const Dots: React.FC<{ count: number; active: number }> = ({ count, active }) => (
  <View style={styles.dotsRow}>
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          i === active ? styles.dotActive : styles.dotInactive,
        ]}
      />
    ))}
  </View>
);

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR (animated on mount)
// ─────────────────────────────────────────────────────────────
const ProgressBar: React.FC<{ value?: number }> = ({ value = 75 }) => {
  const trackW = SW - 32 - 48;   // card padding
  const fillW  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillW, {
      toValue: trackW * (value / 100),
      duration: 900,
      delay:    700,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>Гигиена сегодня</Text>
        <Text style={styles.progressPct}>{value}%</Text>
      </View>
      <View style={[styles.progressTrack, { width: trackW }]}>
        <Animated.View style={[styles.progressFill, { width: fillW }]} />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT  — drop-in replacement for <Animated.View header>
// ─────────────────────────────────────────────────────────────
interface Props {
  insetTop:     number;
  headerO:      Animated.Value;
  headerY:      Animated.Value;
  hygieneScore?: number;
  onBellPress: () => void;
}

export const HeaderCard: React.FC<Props> = ({
  insetTop,
  headerO,
  headerY,
  onBellPress,
}) => {
  const { data } = useMeQuery()
  const [ activeSlide, setActiveSlide] = useState(0);
  const unreadCount = data?.unreadNotifications
  // slide width = card width - inner padding (24) - gap hint (peek)
  const cardW  = SW - 32;        // 16px margin each side
  const slideW = cardW - 24;     // inner horizontal padding 12*2

  // 3D entry tilt: card "falls" into place on mount
  const tilt3D = useRef(new Animated.Value(10)).current;
  useEffect(() => {
    Animated.spring(tilt3D, {
      toValue: 0,
      useNativeDriver: true,
      tension: 48,
      friction: 8,
      delay: 200,
    }).start();
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(
      e.nativeEvent.contentOffset.x / slideW,
    );
    setActiveSlide(Math.min(Math.max(idx, 0), SLIDES.length - 1));
  };

  return (
    <Animated.View
      style={[
        styles.headerOuter,
        {
          paddingTop: insetTop + 8,
          opacity: headerO,
          transform: [
            { translateY: headerY },
            { translateY: tilt3D },   // 3D entry drop
          ],
        },
      ]}
    >
      {/* ── 3D card layers ── */}
      {/* Layer 4 — deepest, most offset */}
      <View style={[styles.layer, styles.layer4]} />
      {/* Layer 3 */}
      <View style={[styles.layer, styles.layer3]} />
      {/* Layer 2 */}
      <View style={[styles.layer, styles.layer2]} />

      {/* Layer 1 — main card content */}
      <View style={styles.layer1}>

        {/* ── Top Row: greeting + avatar + bell ── */}
        <View style={styles.topRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Привет, {data?.name} 👋
            </Text>
          </View>

          <View style={styles.heroActions}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>
                {data?.name?.slice(0, 2).toUpperCase()}
              </Text>
              {/*<View style={styles.avatarOnline} />*/}
            </View>

            {/* Bell */}
            <TouchableOpacity
              style={styles.notifBtn}
              activeOpacity={0.75}
              onPress={onBellPress}
            >
              <AntDesign name={'bell'} size={22}  color={Colors.dangerLight} />

              {unreadCount && unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Horizontal Slider ── */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={slideW}
          snapToAlignment="start"
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          contentContainerStyle={{ gap: 0 }}
          style={styles.sliderScroll}
        >
          {SLIDES.map((slide, i) => (
            <SlideItem key={slide.icon + i} item={slide} slideW={slideW} />
          ))}
        </ScrollView>

        {/* ── Dots ── */}
        <Dots count={SLIDES.length} active={activeSlide} />

        {/* ── Progress Bar ── */}
        {/*<ProgressBar value={hygieneScore} />*/}

      </View>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const CARD_R  = 22;
const PAD_H   = 16;

const styles = StyleSheet.create({

  // ── Outer wrapper (positions all 4 layers) ────────────────
  headerOuter: {
    marginHorizontal: 16,
    // Height = layer offsets + content; let content drive height
  },

  // ── 3D Layers ─────────────────────────────────────────────
  layer: {
    position: 'absolute',
    left: 0, right: 0,
    borderRadius: CARD_R,
  },
  layer4: {
    top: 12, bottom: -12,
    marginHorizontal: 12,
    backgroundColor: 'rgba(74,159,245,0.12)',
  },
  layer3: {
    top: 8, bottom: -8,
    marginHorizontal: 6,
    backgroundColor: C.skyLayer3,
    opacity: 0.45,
  },
  layer2: {
    top: 4, bottom: -4,
    marginHorizontal: 3,
    backgroundColor: C.skyLayer2,
    opacity: 0.65,
  },

  // ── Layer 1 — main card ───────────────────────────────────
  layer1: {
    backgroundColor: C.skyTop,   // swap to LinearGradient skyTop→skyBot
    borderRadius: CARD_R,
    paddingHorizontal: PAD_H,
    paddingTop: 16,
    paddingBottom: 18,
    overflow: 'hidden',
    // sky blue glow shadow
    ...mkShadow(C.skyTop, 0.50, 22, 12),
  },

  // ── Top Row ───────────────────────────────────────────────
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: C.cardText,
    letterSpacing: -0.4,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Avatar
  avatarWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.32)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12, fontWeight: '800', color: C.cardText,
  },
  avatarOnline: {
    position: 'absolute', bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: C.green,
    borderWidth: 2, borderColor: C.skyTop,
  },

  // Bell button
  notifBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifIcon: { fontSize: 20, lineHeight: 22 },
  notifBadge: {
    position: 'absolute', top: -10, right: -10,
    minWidth: 25, height: 25, borderRadius: 999,
    backgroundColor: C.pink,
    borderWidth: 1.5, borderColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 2,
    ...mkShadow(C.pink, 0.50, 6, 2),
  },
  notifBadgeText: {
    fontSize: 12, fontWeight: '900', color: '#fff', lineHeight: 11,
  },

  // ── Slider ────────────────────────────────────────────────
  sliderScroll: {
    marginHorizontal: -PAD_H,     // bleed to card edge
    paddingHorizontal: PAD_H,
  },

  slideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.cardFill,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginRight: 12,
  },

  slideIconBox: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: C.cardIcon,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  slideIconEmoji: { fontSize: 22 },

  slideInfo: { flex: 1, gap: 3 },
  slideLabel:    { fontSize: 9.5, color: C.cardMuted, fontWeight: '500' },
  slideTitle:    { fontSize: 14,  color: C.cardText,  fontWeight: '800', letterSpacing: -0.3 },
  slideSubtitle: { fontSize: 11,  color: C.teal,      fontWeight: '700' },
  slideDetail:   { fontSize: 9.5, color: C.cardMuted },

  slideBadge: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 12,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 10,
  },
  slideBadgeText: {
    fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 0.4,
  },

  // ── Dots ──────────────────────────────────────────────────
  dotsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 4,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 16, height: 7,
    backgroundColor: '#fff',
  },
  dotInactive: {
    width: 7, height: 7,
    backgroundColor: 'rgba(255,255,255,0.32)',
  },

  // ── Progress Bar ──────────────────────────────────────────
  progressWrap: {
    marginTop: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10, color: C.cardSub, fontWeight: '500',
  },
  progressPct: {
    fontSize: 10, color: C.teal, fontWeight: '800',
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    borderRadius: 4,
    backgroundColor: C.teal,
    ...mkShadow(C.teal, 0.45, 6, 2),
  },
});


