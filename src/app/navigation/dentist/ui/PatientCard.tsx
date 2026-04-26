import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";

export default function PatientCard({ item }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>

      <Text style={styles.tag}>{item.tag}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>LAST VISIT</Text>
        <Text style={styles.label}>UPCOMING</Text>
      </View>

      <View style={styles.row}>
        <Text>{item.last}</Text>
        <Text style={{ color: bookingColors.sky }}>{item.next}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: bookingColors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontWeight: '600',
    color: bookingColors.text,
  },
  tag: {
    color: bookingColors.sky,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    color: bookingColors.textMuted,
  },
});