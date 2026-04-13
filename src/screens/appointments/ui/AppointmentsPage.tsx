// src/pages/appointments/ui/AppointmentsPage.tsx
import React, { useState } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@shared/theme/colors';
import { AppointmentCard } from '@entities/appointment';
import { useBookingStore } from '@features/booking';
import { useCancelConfirm } from '@features/appointment-cancel';
import { AppointmentsTabs, AppointmentsTab } from '@widgets/appointments-list';
import { EmptyState } from '@shared/ui';

export const AppointmentsPage: React.FC = () => {
  const { state } = useBookingStore();
  const { confirmCancel } = useCancelConfirm();
  const [tab, setTab] = useState<AppointmentsTab>('upcoming');

  const filtered = state.appointments.filter(a =>
    tab === 'upcoming' ? a.status === 'upcoming' : a.status !== 'upcoming'
  );

  const upcomingCount = state.appointments.filter(a => a.status === 'upcoming').length;

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Мои записи</Text>
      <AppointmentsTabs
        active={tab}
        upcomingCount={upcomingCount}
        onChange={setTab}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onCancel={confirmCancel}
            onReview={() => {}}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title={tab === 'upcoming' ? 'Нет предстоящих записей' : 'История пуста'}
            subtitle={
              tab === 'upcoming'
                ? 'Запишитесь на приём в разделе «Запись»'
                : 'Завершённые визиты появятся здесь'
            }
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
});
