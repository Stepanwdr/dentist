import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@shared/theme/colors';

type Props = {
  percent: number; // 0-100
  label?: string;
};

export const DailyCapacity: React.FC<Props> = ({ percent, label = 'Daily Capacity' }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.caption}>{percent}%</Text>
      <View style={styles.barBackground}>
        <View style={[styles.bar, { width: `${percent}%` }]} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', paddingHorizontal: 6 },
  caption: { fontSize: 12, color: Colors.textMuted },
  barBackground: { height: 8, width: '100%', backgroundColor: '#E5E7EB', borderRadius: 6, marginTop: 6, overflow: 'hidden' },
  bar: { height: 8, backgroundColor: Colors.primary, borderRadius: 6 },
  label: { fontSize: 12, color: Colors.textMuted, marginTop: 6 },
});
