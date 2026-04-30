import React, {useCallback, useMemo} from 'react';
import {StyleSheet, FlatList, Dimensions, Alert, View, Text } from 'react-native';
import {HomeColor} from "@shared/theme/home";
import {TimeSlot} from "@shared/types/slot";
import {SwipeRow} from "@widgets/booking/ui/BookingsScreen/ui/SwipeRow";
import {navigate} from "@app/navigation/navigationRef";
import {useConfirmBookStatus} from "@features/confirm-book/model";
import {useGetBookings, useGetNextBooking} from "@entities/booking/model/booking.model";
import {useChangeBookingStatus} from "@features/change-book-status/model";
import {toDayKey} from "@shared/utils/date";
import {useFocusEffect} from "@react-navigation/native";
import {s} from "@widgets/booking/ui/BookingsScreen/BookingScreen.styles";

type QueueItem = { id: string; name: string; time?: string; note?: string };

type Props = { items: QueueItem[], setBookId: (id: number | null) => void};

export const QueueList: React.FC<Props> = ({  setBookId }) => {
  const today=toDayKey(new Date());
  const {data} = useGetNextBooking()

  const { data: bookingsData, refetch, isPending,isRefetching } = useGetBookings({ status: 'upcoming', date:today });
  const { mutate: onCancelBook } = useChangeBookingStatus(refetch)
  const keyExtractor = useCallback((item: TimeSlot) => String(item.id), []);
  const filteredData= useMemo(()=> bookingsData?.slots.filter(item=>item.id!==data?.id),[bookingsData,data])
  const { mutate: onConfirmBook } = useConfirmBookStatus(refetch)

  const handleView = useCallback((item: TimeSlot) => {
    setBookId(item.id)
  }, []);

  const handleEdit = useCallback((item: TimeSlot) => {
    Alert.alert('Изменить запись', `${item.startTime} – ${item.endTime} · ${item.date}`, [
      { text: 'Отмена',    style: 'cancel' },
      { text: 'Да', onPress: () => navigate('BookingTab', {
          dentistId: item.dentistId,
          book: item,
        }) },
    ]);
  }, []);

  const handleConfirm = useCallback((item: TimeSlot) => {
    Alert.alert('Подтвердить запись', `${item.startTime} – ${item.endTime} · ${item.date}`, [
      { text: 'Подтвердить',    style: 'destructive' },
      { text: 'Да', onPress: () => onConfirmBook({id: item.id}) },
    ]);
  }, []);

  const PendingEmpty = useCallback(() => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>📋</Text>
      <Text style={s.emptyTitle}>Нет пациентов в очереди</Text>
    </View>
  ), []);


  const handleCancel = useCallback((item: TimeSlot) => {
    Alert.alert(
      'Отменить запись?',
      `${item.dentist?.name} · ${item.date} · ${item.startTime}`,
      [
        { text: 'Нет', style: 'cancel' },
        {
          text:    'Отменить',
          style:   'destructive',
          onPress: () => onCancelBook({ status:'cancelled',id:item.id }),
        },
      ],
    );
  }, []);

  const renderList = useCallback(({ item }: { item: TimeSlot }) => (
    <SwipeRow
      item={item}
      onView={handleView}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      isDentist={true}
    />
  ), [handleView, handleEdit, handleCancel]);


  useFocusEffect(useCallback(()=> refetch,[]))


  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={PendingEmpty}
      renderItem={renderList}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      data={filteredData}
    />
  );
};

const styles = StyleSheet.create({
  queueItem: { backgroundColor: HomeColor.white, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  queueAvatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: HomeColor.primaryLight },
  queueInfo: { flex: 1, marginLeft: 12 },
  queueName: { fontSize: 16, fontWeight: '700', color: HomeColor.text },
  queueSub: { fontSize: 12, color: HomeColor.textSub, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  list:{
    gap:5,
    paddingBottom: 80
  },
  fab: { position: 'absolute', bottom: 30, left: Dimensions.get('window').width / 2 - 30, width: 60, height: 60, borderRadius: 30, backgroundColor: HomeColor.primaryDark, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: HomeColor.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }
});
