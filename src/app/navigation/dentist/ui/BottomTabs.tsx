import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";

export default function BottomTabs({ active }: any) {
  return (
    <View style={styles.container}>
      {['schedule', 'patients', 'treatments', 'settings'].map(tab => (
        <Text
          key={tab}
          style={[styles.tab, active === tab && styles.active]}
        >
          {tab}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: bookingColors.white,
    borderRadius: 20,
  },
  tab: {
    color: bookingColors.textMuted,
  },
  active: {
    color: bookingColors.sky,
    fontWeight: '600',
  },
});