import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";
import {PatientsList} from "@entities/patient/patients-list/patients-list";

export default function PatientsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Пациенты</Text>
      <PatientsList/>
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