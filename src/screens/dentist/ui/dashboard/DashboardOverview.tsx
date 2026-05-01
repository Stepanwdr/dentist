import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@shared/theme/colors';
import {bookingColors} from "@shared/theme/Booking.colors";

type Props = {
  doctorName?: string;
  greeting?: string;
};

export const DashboardOverview: React.FC<Props> = ({ doctorName = 'Dr. Smith', greeting = 'GOOD MORNING' }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>{greeting} {doctorName.toUpperCase()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 15 },
  greeting: { fontSize: 24, fontWeight: '700',color: bookingColors.sky },
  title: { fontSize: 24, fontWeight: '700', marginTop: 4, color: Colors.text },
});
