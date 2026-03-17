// src/pages/services/ui/ServicesPage.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '@shared/config/colors';
import { SERVICES } from '@entities/service';
import { Service } from '@shared/types';
import { useBookingStore, useBookingActions } from '@features/booking';
import { ServicesList } from '@widgets/services-list';
import { RootStackParamList } from '@app/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Services'>;
};

export const ServicesPage: React.FC<Props> = ({ navigation }) => {
  const { state } = useBookingStore();
  const { selectService } = useBookingActions();

  const upcomingCount = state.appointments.filter(a => a.status === 'upcoming').length;

  function handleSelect(service: Service) {
    selectService(service);
    navigation.navigate('Doctors', { serviceId: service.id });
  }

  const hygieneService = SERVICES.find(s => s.id === '4')!;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Добрый день 👋</Text>
          <Text style={styles.title}>Выберите услугу</Text>
        </View>
        {upcomingCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{upcomingCount} запись</Text>
          </View>
        )}
      </View>
      <ServicesList
        services={SERVICES}
        onSelect={handleSelect}
        onPromoBannerPress={() => handleSelect(hygieneService)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: { fontSize: 14, color: Colors.textMuted, marginBottom: 2 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text },
  badge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
