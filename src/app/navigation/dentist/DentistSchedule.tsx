import React, { useState, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { CalendarSection } from '@features/book-slot/ui/CalendarSection';
import { useGetAvailableDates } from '@entities/booking/model/booking.model';
import { toDayKey, normalizeDate } from '@shared/utils/date';
import { Colors } from '@shared/theme/colors';

type Props = {
  route: { params?: { dentistId?: string | number } };
};

export const DentistScheduleScreen: React.FC<Props> = ({ route }) => {
  const dentistId = Number(route?.params?.dentistId ?? 0);
  const todayKey = toDayKey(normalizeDate(new Date()));
  const futureKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return toDayKey(normalizeDate(d));
  }, []);

  // Available dates for the dentist
  const { data: available = new Set<string>() } = useGetAvailableDates({
    dentistId,
    from: todayKey,
    to: futureKey,
  });

  const [selectedDate, setSelectedDate] = useState<Date>(normalizeDate(new Date()));

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Расписание доктора</Text>
      <CalendarSection
        selectedDate={selectedDate}
        available={available}
        onDateChange={setSelectedDate}
        minYear={new Date().getFullYear()}
        maxYear={new Date().getFullYear() + 2}
      />
      <Text style={styles.hint}>Выберите дату для просмотра и управления слотами.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: '700', margin: 12, color: '#4A90D9' },
  hint: { textAlign: 'center', color: Colors.textMuted, marginTop: 8 },
});
