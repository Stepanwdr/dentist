// src/pages/doctors/ui/DoctorsPage.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '@shared/config/colors';
import { Doctor, Service } from '@shared/types';
import { DOCTORS } from '@entities/doctor';
import { SERVICES } from '@entities/service';
import { useBookingActions } from '@features/booking';
import { DoctorsList } from '@widgets/doctors-list';
import { RootStackParamList } from '@app/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Doctors'>;
  route: RouteProp<RootStackParamList, 'Doctors'>;
};

export const DoctorsPage: React.FC<Props> = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const { selectDoctor } = useBookingActions();

  const service: Service = SERVICES.find(s => s.id === serviceId) ?? SERVICES[0];
  const doctors: Doctor[] = DOCTORS.filter(d => d.serviceIds.includes(serviceId));

  function handleSelect(doctor: Doctor) {
    selectDoctor(doctor);
    navigation.navigate('Booking');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <DoctorsList doctors={doctors} service={service} onSelect={handleSelect} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
});
