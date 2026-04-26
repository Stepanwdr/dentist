import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";
import PatientCard from "@app/navigation/dentist/ui/PatientCard";

const DATA = [
  {
    name: 'Sarah Jenkins',
    tag: 'VIP',
    last: 'Oct 12, 2023',
    next: 'Nov 04, 10:30 AM',
  },
  {
    name: 'Marcus Thorne',
    tag: 'Invisalign',
    last: 'Sep 28, 2023',
    next: 'Today, 02:15 PM',
  },
];

export default function PatientsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DentistPro</Text>

      <FlatList
        data={DATA}
        renderItem={({ item }) => <PatientCard item={item} />}
      />
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
});