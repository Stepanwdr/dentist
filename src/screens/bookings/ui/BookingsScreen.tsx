import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View, Text, FlatList,
  Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimeSlot }           from '@shared/types/slot';
import { bookingColors as C } from '@shared/theme/Booking.colors';
import { s }                  from '@widgets/booking/ui/BookingsScreen/BookingScreen.styles';
import { AppointmentsTab, BookingTabs} from "@widgets/booking/ui/BookingsScreen/ui/BookingTabs";
import { CompletedRow } from "@widgets/booking/ui/BookingsScreen/ui/CompletedRow";
import { SwipeRow } from "@widgets/booking/ui/BookingsScreen/ui/SwipeRow";
import { useGetBookings } from "@entities/booking/model/booking.model";
import {useFocusEffect} from "@react-navigation/native";


const BookingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [tab,  setTab]  = useState<AppointmentsTab>('upcoming');
  const { data: bookingsData, refetch, isPending,isRefetching } = useGetBookings({ status: tab || ''});

  const [data, setData] = useState<TimeSlot[]>([]); // ← заменить на данные из хука


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
  const renderList = useCallback(({ item }: { item: TimeSlot }) => (
    <SwipeRow
      item={item}
      onReschedule={handleReschedule}
      onEdit={handleEdit}
      onCancel={handleCancel}
    />
  ), [handleReschedule, handleEdit, handleCancel]);

  const renderCompleted = useCallback(({ item }: { item: TimeSlot }) => (
    <CompletedRow item={item} />
  ), [handleRebook]);

  const keyExtractor = useCallback((item: TimeSlot) => String(item.id), []);

  const UpcomingEmpty = useCallback(() => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>📅</Text>
      <Text style={s.emptyTitle}>Нет предстоящих записей</Text>
      <Text style={s.emptyTxt}>Запишитесь на приём</Text>
    </View>
  ), []);

  const FinishedEmpty = useCallback(() => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>📋</Text>
      <Text style={s.emptyTitle}>Нет завершённых записей</Text>
      <Text style={s.emptyTxt}>История визитов появится здесь</Text>
    </View>
  ), []);

  const CancelledEmpty = useCallback(() => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>📋</Text>
      <Text style={s.emptyTitle}>Нет Отмененных записей</Text>
    </View>
  ), []);

  const emptyContent = {
    upcoming: UpcomingEmpty,
    finished: FinishedEmpty,
    cancelled: CancelledEmpty,
  }
  const paddingBottom = { paddingBottom: insets.bottom + 80 };

  useEffect(() => {
    setData(bookingsData ?? []);
  }, [bookingsData]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [tab])
  );

  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Text style={s.headerTitle}>Мои записи</Text>
        <View style={[s.countBadge, { backgroundColor: C.skyLight }]}>
          <Text style={[s.countTxt, { color: C.skyTop }]}>
            Запись {data.length}
          </Text>
        </View>
      </View>
      {/* Tabs */}
      <BookingTabs
        active={tab}
        upcomingCount={0}
        completedCount={0}
        onChange={setTab}
      />
      {tab==='upcoming' &&
        <View style={s.hint}>
          <Text style={s.hintTxt}>← свайп влево для действий</Text>
       </View>
      }
      {isPending || isRefetching ? <ActivityIndicator color={'#94A3B8'} size={'large'}/> : <FlatList
        data={data}
        renderItem={tab === 'upcoming' ? renderList : renderCompleted}
        keyExtractor={keyExtractor}
        ListEmptyComponent={emptyContent[tab]}
        contentContainerStyle={[s.listContent, paddingBottom]}
        showsVerticalScrollIndicator={false}
      />}
    </View>
  );
};

export default BookingsScreen;