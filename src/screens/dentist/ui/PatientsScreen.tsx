import React, {useRef} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";
import {PatientsList} from "@entities/patient/patients-list/patients-list";
import {CreatePatientDrawer, CreatePatientDrawerRef} from "@features/CraetePatientDrawer/CraetePatientDrawer";

export default function PatientsScreen() {
  const drawerRef = useRef<CreatePatientDrawerRef>(null);

  const openDrawer = () => {
    drawerRef.current?.open()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Пациенты</Text>
      <PatientsList openDrawer={openDrawer}/>
      <CreatePatientDrawer ref={drawerRef}   />
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