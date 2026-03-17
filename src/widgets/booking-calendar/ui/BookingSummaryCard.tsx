// src/widgets/booking-calendar/ui/BookingSummaryCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingDraft } from '@shared/types';
import { Colors } from '@shared/config/colors';

interface BookingSummaryCardProps {
  draft: BookingDraft;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ draft }) => {
  const { service, doctor } = draft;
  if (!service || !doctor) return null;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="medical" size={20} color={Colors.surface} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.service}>{service.title}</Text>
        <Text style={styles.doctor}>{doctor.name}</Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>{service.duration}</Text>
          <Ionicons name="card-outline" size={13} color={Colors.textMuted} style={{ marginLeft: 8 }} />
          <Text style={styles.metaText}>{service.price}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  service: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  doctor: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: Colors.textMuted },
});
