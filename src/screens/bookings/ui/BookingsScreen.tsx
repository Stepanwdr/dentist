import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View, Text, FlatList,
  Alert, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimeSlot }           from '@shared/types/slot';
import { bookingColors as C } from '@shared/theme/Booking.colors';
import { s }                  from '@widgets/booking/ui/BookingsScreen/BookingScreen.styles';
import { AppointmentsTab, BookingTabs} from "@widgets/booking/ui/BookingsScreen/ui/BookingTabs";
import { CompletedRow } from "@widgets/booking/ui/BookingsScreen/ui/CompletedRow";
import { SwipeRow } from "@widgets/booking/ui/BookingsScreen/ui/SwipeRow";
import { useGetBookings } from "@entities/booking/model/booking.model";

// ─── Mock — замени на useGetBookings ──────────────────
// const { data } = useGetBookings({ dentistId, date, isBooked: true });

const BookingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const { data:bookingsData } = useGetBookings({dentistId: '4', date: '2026-03-23',});
  const [tab,  setTab]  = useState<AppointmentsTab>('upcoming');
  const [data, setData] = useState<TimeSlot[]>([]); // ← заменить на данные из хука

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // сброс времени — только дата
    return d;
  }, []);

// item.date = '2026-03-23' → new Date('2026-03-23') = полночь UTC
  const upcoming = useMemo(
    () => data.filter(item => new Date(item.date).getUTCSeconds() >= today.getUTCSeconds()),
    [data, today],
  );
  const completed = useMemo(
    () => data.filter(item => new Date(item.date).getUTCSeconds() < today.getUTCSeconds()),
    [data, today],
  );
  // ── Handlers ──────────────────────────────────────
  const handleReschedule = useCallback((item: TimeSlot) => {
    Alert.alert('Перенос записи', `${item.dentist?.name} · ${item.date}`, [
      { text: 'Отмена',   style: 'cancel' },
      { text: 'Перенести', onPress: () => {} },
    ]);
  }, []);

  const handleEdit = useCallback((item: TimeSlot) => {
    Alert.alert('Изменить запись', `${item.startTime} – ${item.endTime} · ${item.date}`, [
      { text: 'Отмена',    style: 'cancel' },
      { text: 'Сохранить', onPress: () => {} },
    ]);
  }, []);

  const handleCancel = useCallback((item: TimeSlot) => {
    Alert.alert(
      'Отменить запись?',
      `${item.dentist?.name} · ${item.date} · ${item.startTime}`,
      [
        { text: 'Нет', style: 'cancel' },
        {
          text:    'Отменить',
          style:   'destructive',
          onPress: () => setData(prev => prev.filter(x => x.id !== item.id)),
        },
      ],
    );
  }, []);

  const handleRebook = useCallback((item: TimeSlot) => {
    Alert.alert('Повторная запись', `Записаться к ${item.dentist?.name}?`, [
      { text: 'Отмена',    style: 'cancel' },
      { text: 'Записаться', onPress: () => {} },
    ]);
  }, []);

  // ── renderItem ────────────────────────────────────
  const renderUpcoming = useCallback(({ item }: { item: TimeSlot }) => (
    <SwipeRow
      item={item}
      onReschedule={handleReschedule}
      onEdit={handleEdit}
      onCancel={handleCancel}
    />
  ), [handleReschedule, handleEdit, handleCancel]);

  const renderCompleted = useCallback(({ item }: { item: TimeSlot }) => (
    <CompletedRow item={item} onRebook={handleRebook} />
  ), [handleRebook]);

  const keyExtractor = useCallback((item: TimeSlot) => String(item.id), []);

  const UpcomingEmpty = useCallback(() => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>📅</Text>
      <Text style={s.emptyTitle}>Нет предстоящих записей</Text>
      <Text style={s.emptyTxt}>Запишитесь на приём</Text>
    </View>
  ), []);

  const CompletedEmpty = useCallback(() => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>📋</Text>
      <Text style={s.emptyTitle}>Нет завершённых записей</Text>
      <Text style={s.emptyTxt}>История визитов появится здесь</Text>
    </View>
  ), []);

  const paddingBottom = { paddingBottom: insets.bottom + 24 };

  useEffect(() => {
    setData(bookingsData ?? []);

  }, [bookingsData]);
  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Text style={s.headerTitle}>Мои записи</Text>
        <View style={[s.countBadge, { backgroundColor: C.skyLight }]}>
          <Text style={[s.countTxt, { color: C.skyTop }]}>
            {upcoming.length} активных
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <BookingTabs
        active={tab}
        upcomingCount={upcoming.length}
        completedCount={completed.length}
        onChange={setTab}
      />

      {/* Hint */}
      {tab === 'upcoming' && upcoming.length > 0 && (
        <View style={s.hint}>
          <Text style={s.hintTxt}>← свайп влево для действий</Text>
        </View>
      )}

      {/* List */}
      {tab === 'upcoming' ? (
        <FlatList
          data={upcoming}
          renderItem={renderUpcoming}
          keyExtractor={keyExtractor}
          ListEmptyComponent={UpcomingEmpty}
          contentContainerStyle={[s.listContent, paddingBottom]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={completed}
          renderItem={renderCompleted}
          keyExtractor={keyExtractor}
          ListEmptyComponent={CompletedEmpty}
          contentContainerStyle={[s.listContent, paddingBottom]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default BookingsScreen;