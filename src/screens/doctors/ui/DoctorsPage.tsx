import React from 'react';
import {StyleSheet, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '@shared/theme/colors';
import { Doctor, Service } from '@shared/types';
import { DOCTORS } from '@entities/doctor';
import { useBookingActions } from '@features/booking';
import {DoctorList} from '@widgets/doctors-list';
import { TabParamList} from '@app/navigation/types';
import {FULL_SERVICES} from "@entities/service/model/mockData";

type Props = {
  navigation: NativeStackNavigationProp<TabParamList, 'HomeTab'>;
  route: RouteProp<TabParamList, 'HomeTab'>;
};

 const DoctorsPage: React.FC<Props> = ({navigation}) => {
  const serviceId = '5'
  const { selectDoctor } = useBookingActions();

  const service: Service = FULL_SERVICES.find(s => s.id === serviceId) ?? FULL_SERVICES[0];
  const doctors: Doctor[] = DOCTORS.filter(d => d.serviceIds.includes(serviceId));

  function handleSelect(doctor: Doctor) {
    selectDoctor(doctor);
    // navigation.navigate('Booking');
  }

  return (
    <SafeAreaView style={styles.safe}>
       <Text style={styles.pageTitle}>Врачи</Text>
       <DoctorList navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background,marginTop:10 },
  pageTitle:{ fontSize:24, margin:16, color:'#4A90D9',marginTop:0 },
});

export default DoctorsPage;