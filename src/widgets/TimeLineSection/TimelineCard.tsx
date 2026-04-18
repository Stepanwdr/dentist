import React, {useEffect, useRef} from "react";
import {Animated, View, Text, StyleSheet, Platform} from "react-native";
import {HomeColor, SHADOW_SM} from "@shared/theme/home";
import {TimelineDate} from "@shared/types/slot";

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
        ? <View style={[styles.dateDot, { backgroundColor: HomeColor.teal }]} />
        : <View style={[styles.dateDot, { backgroundColor: HomeColor.border }]} />
      }
    </Animated.View>
  );
};

export default TimelineCard;


const styles = StyleSheet.create({
  nextCard: {
    width: 72,
    height: 70,
    borderRadius: 20,
    backgroundColor: HomeColor.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: HomeColor.pink,
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
    color: HomeColor.white,
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
    backgroundColor: HomeColor.pink,
  },
  // ── Connector ──
  connectorWrap: {
    alignItems: 'center',
  },
  connectorLine: {
    width: 2,
    backgroundColor: HomeColor.pink,
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
    backgroundColor: HomeColor.pink,
  },
  // ── Date Card ──
  dateCard: {
    width: 56,
    height: 70,
    borderRadius: 16,
    backgroundColor: HomeColor.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...SHADOW_SM,
  },
  dateMonth: {
    fontSize: 10,
    color: HomeColor.textMuted,
    fontWeight: '500',
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '800',
    color: '#475569',
    lineHeight: 26,
  },
  dateDayMuted: {
    color: HomeColor.textMuted,
  },
  dateDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 2,
  },

})