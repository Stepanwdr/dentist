// src/pages/booking/ui/BookingPage.tsx
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '@shared/config/colors';
import { generateCalendarDays } from '@shared/lib/formatDate';
import { useI18n } from '@shared/i18n/core';
import { TIME_SLOTS, BUSY_SLOTS } from '@entities/appointment';
import { useBookingStore, useBookingActions, DayPicker, TimeSlotGrid } from '@features/booking';
import { BookingSummaryCard, BookingFooter } from '@widgets/booking-calendar';
import { RootStackParamList } from '@app/navigation/types';
import type { CalendarDay } from '@shared/lib/formatDate';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Booking'>;
};

export const BookingPage: React.FC<Props> = ({ navigation }) => {
  const { state } = useBookingStore();
  const { selectDateTime, confirmBooking } = useBookingActions();
  const { t, locale } = useI18n();

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const days = useMemo(() => generateCalendarDays(30), [locale]);

  const busyTimes = useMemo(() => {
    if (!state.draft.doctor || !selectedDateKey) return [];
    const key = `${state.draft.doctor.id}_${selectedDateKey}`;
    return BUSY_SLOTS[key] ?? [];
  }, [state.draft.doctor, selectedDateKey]);

  const selectedDay = days.find(d => d.key === selectedDateKey);

  function handleConfirm() {
    if (!selectedDateKey || !selectedTime) {
      Alert.alert(t('alert.selectDateTime'));
      return;
    }
    selectDateTime(selectedDateKey, selectedTime);
    const apt = confirmBooking();
    if (apt) {
      navigation.navigate('Confirmation', { appointmentId: apt.id });
    }
  }

  if (!state.draft.service || !state.draft.doctor) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>Сначала выберите услугу и врача</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <BookingSummaryCard draft={state.draft} />

        <Text style={styles.sectionTitle}>{t('booking.selectDate')}</Text>
        <DayPicker
          days={days}
          selectedKey={selectedDateKey}
          onSelect={key => {
            setSelectedDateKey(key);
            setSelectedTime(null);
          }}
        />

        {selectedDateKey && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t('booking.selectTime')}</Text>
            <TimeSlotGrid
              slots={TIME_SLOTS}
              busySlots={busyTimes}
              selectedSlot={selectedTime}
              onSelect={setSelectedTime}
            />
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <BookingFooter
        selectedDay={selectedDay}
        selectedTime={selectedTime}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  error: { textAlign: 'center', marginTop: 40, color: Colors.textSecondary, fontSize: 16 },
});
