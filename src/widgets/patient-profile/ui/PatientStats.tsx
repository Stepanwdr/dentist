// src/widgets/patient-profile/ui/PatientStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/theme/colors';

interface PatientStatsProps {
  completedCount: number;
  upcomingCount: number;
}

export const PatientStats: React.FC<PatientStatsProps> = ({ completedCount, upcomingCount }) => (
  <View style={styles.row}>
    <View style={styles.card}>
      <Text style={styles.num}>{completedCount}</Text>
      <Text style={styles.label}>Посещений</Text>
    </View>
    <View style={[styles.card, styles.cardHighlight]}>
      <Text style={styles.num}>{upcomingCount}</Text>
      <Text style={styles.label}>Предстоит</Text>
    </View>
    <View style={styles.card}>
      <Ionicons name="star" size={20} color={Colors.warning} />
      <Text style={styles.label}>Постоянный</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHighlight: { borderWidth: 1.5, borderColor: Colors.primary },
  num: { fontSize: 22, fontWeight: '700', color: Colors.text },
  label: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
});
