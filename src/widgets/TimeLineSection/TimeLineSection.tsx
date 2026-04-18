import {ScrollView, Text, StyleSheet, View} from "react-native";
import React from "react";
import TimelineCard from "./TimelineCard";
import {HomeColor} from "@shared/theme/home";
import {TimelineDate} from "@shared/types/slot";

const TIMELINE: TimelineDate[] = [
  { month: 'Март', day: 28, done: true },
  { month: 'Апр',  day: 15, done: true },
  { month: 'Апр',  day: 28, done: true },
  { month: 'Май',  day: 10, done: false, isNext: true },
  { month: 'Июн',  day: 28, done: false },
  { month: 'Июл',  day: 15, done: false },
];


export const TimeLineSection = () => {
  return (
    <View
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
      </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: HomeColor.primary,
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: -0.3,
  },

  timelineRow: {
    paddingRight: 24,
    gap: 10,
    alignItems: 'center',
    padding: 12,
    paddingLeft: 5,
    paddingBottom: 20
  },
})