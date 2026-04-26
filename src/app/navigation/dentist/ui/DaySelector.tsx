import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";

export default function DaySelector() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  return (
    <View style={styles.row}>
      {days.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.day, i === 1 && styles.active]}
        >
          <Text style={i === 1 ? styles.activeText : styles.text}>
            {d}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  day: {
    padding: 12,
    backgroundColor: bookingColors.white,
    borderRadius: 10,
    marginRight: 8,
  },
  active: {
    backgroundColor: bookingColors.sky,
  },
  text: {
    color: bookingColors.textSub,
  },
  activeText: {
    color: 'white',
  },
});