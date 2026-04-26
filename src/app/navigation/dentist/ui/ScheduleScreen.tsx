import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AppointmentCard from "@app/navigation/dentist/ui/AppointmentCard";
import DaySelector from "@app/navigation/dentist/ui/DaySelector";
import BottomTabs from "@app/navigation/dentist/ui/BottomTabs";
import {bookingColors} from "@shared/theme/Booking.colors";


const DATA = [
  {
    time: '09:00',
    name: 'Sarah Mitchell',
    type: 'Root Canal Treatment',
    status: 'confirmed',
  },
  {
    time: '10:30',
    name: 'James Wilson',
    type: 'Regular Checkup',
    status: 'pending',
  },
];

export default function ScheduleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DentistPro</Text>

      <DaySelector />

      <FlatList
        data={DATA}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.time}>{item.time}</Text>
            <AppointmentCard item={item} />
          </View>
        )}
      />

      <BottomTabs active="schedule" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bookingColors.bg,
    padding: 16,
    paddingTop:50
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: bookingColors.sky,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  time: {
    width: 60,
    color: bookingColors.textMuted,
  },
});