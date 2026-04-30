import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View, Text, FlatList,
  Alert, StatusBar, ActivityIndicator, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TimeSlot }           from '@shared/types/slot';
import { bookingColors as C } from '@shared/theme/Booking.colors';
import { s }                  from '@widgets/booking/ui/BookingsScreen/BookingScreen.styles';
import { CompletedRow } from "@widgets/booking/ui/BookingsScreen/ui/CompletedRow";
import { SwipeRow } from "@widgets/booking/ui/BookingsScreen/ui/SwipeRow";
import { useGetBooking, useGetBookings } from "@entities/booking/model/booking.model";
import {useFocusEffect} from "@react-navigation/native";
import {useChangeBookingStatus} from "@features/change-book-status/model";
import {BottomSheetDetail} from "@features/book-slot/ui/BottomSheetDetail";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {TabParamList} from "@app/navigation/types";
import {Tabs} from "@shared/ui/Tabs";
import {useAuth} from "@features/auth/model/useAuth";
import {useConfirmBookStatus} from "@features/confirm-book/model";
import {useRoute} from "@react-navigation/core";


export type AppointmentsTab =
  | 'upcoming'
  | 'finished'
  | 'cancelled'
  | 'pending'


const tabs:{ label:string,value:AppointmentsTab}[] = [
  { label: 'Предстоящие', value: 'upcoming' },
  { label: 'Отмененные', value: 'cancelled' },
  { label: 'Завершённые', value: 'finished' },
];

const dentistTabs:{ label:string,value:AppointmentsTab}[] = [
  { label: 'Предстоящие', value: 'upcoming' },
  { label: 'В ожидании', value: 'pending' },
  { label: 'Отмененные', value: 'cancelled' },
  { label: 'Завершённые', value: 'finished' },
];



interface Props {
  navigation: NativeStackNavigationProp<TabParamList, 'AppointmentsTab'>;
}

const BookingsScreen: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {user}=useAuth()
  const route = useRoute<any>();
  const bookingId=route.params?.params.bookingId
  const isDentist = user?.role === "dentist";
  const [tab,  setTab]  = useState<AppointmentsTab>('upcoming');
  const { data: bookingsData, refetch, isPending,isRefetching } = useGetBookings({ status: tab || '' });
  const { mutate: onCancelBook } = useChangeBookingStatus(refetch)
  const { mutate: onConfirmBook } = useConfirmBookStatus(refetch)

  const [data, setData] = useState<TimeSlot[]>([]); // ← заменить на данные из хука
  const [bookId,setBookId]=useState<number | null>(bookingId);
  const [sheet, setSheet] = useState(false);
  const { data: selectedBookData } = useGetBooking(bookId || undefined);
  const selectedBook = selectedBookData || {} as TimeSlot;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const { startTime, shortMonth, day, isToday } = useMemo(() => {
    if (!selectedBook?.startTime) return {};

    const date = new Date(selectedBook.date);
    const today = new Date();
    return {
      startTime: selectedBook.startTime,
      shortMonth: date.toLocaleString('en', { month: 'short' }), // May
      day: date.getDate(), // 24
      isToday: date.getDate() === today.getDate()
    };
  }, [selectedBook]);


  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, useNativeDriver: true,
        tension: 55, friction: 7, delay: 200,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500, delay: 100, useNativeDriver: true,
      }),
    ]).start();

    // Auto-open sheet after 800ms
    const t = setTimeout(() =>  bookId ? setSheet(true):setSheet(false), 10);
    return () => clearTimeout(t);
  }, [bookId]);


  // ── Handlers ──────────────────────────────────────
  const handleView = useCallback((item: TimeSlot) => {
    setBookId(item.id)
  }, []);

  const handleEdit = useCallback((item: TimeSlot) => {
    Alert.alert('Изменить запись', `${item.startTime} – ${item.endTime} · ${item.date}`, [
      { text: 'Отмена',    style: 'cancel' },
      { text: 'Да', onPress: () => navigation.navigate('BookingTab', {
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
      onView={handleView}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      isDentist={isDentist}
    />
  ), [handleView, handleEdit, handleCancel]);

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

  const PendingEmpty = useCallback(() => (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>📋</Text>
      <Text style={s.emptyTitle}>Нет записи в ожидании</Text>
    </View>
  ), []);

  const emptyContent = {
    upcoming: UpcomingEmpty,
    finished: FinishedEmpty,
    cancelled: CancelledEmpty,
    pending: PendingEmpty,
  }
  const paddingBottom = { paddingBottom: insets.bottom + 202 };

  useEffect(() => {
    setData(bookingsData?.slots ?? []);
  }, [bookingsData]);

  useEffect(() => {
    setBookId(bookingId );
  }, [bookingId]);

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
        <Text style={s.headerTitle}>{isDentist ? "Записи" : "Мои записи"}</Text>
        <View style={[s.countBadge, { backgroundColor: C.skyLight }]}>
          <Text style={[s.countTxt, { color: C.skyTop }]}>
            Запись {data.length}
          </Text>
        </View>
      </View>
      {/* Tabs */}
      <Tabs<AppointmentsTab>
        active={tab}
        onChange={setTab}
        tabs={isDentist ? dentistTabs : tabs}
      />
     {tab==='upcoming' &&
       <View style={s.hint}>
         <Text style={s.hintTxt}>← свайп влево для действий</Text>
       </View>
     }
     {isPending || isRefetching ? <ActivityIndicator color={'#94A3B8'} size={'large'}/> :
       <FlatList
         data={data}
         renderItem={tab === 'upcoming' || tab==='pending' ? renderList : renderCompleted}
         keyExtractor={keyExtractor}
         ListEmptyComponent={emptyContent[tab]}
         contentContainerStyle={[s.listContent, paddingBottom]}
       />}


      <BottomSheetDetail
        visible={sheet}
        booked={selectedBook}
        onClose={()=> setBookId(null)}
        startTime={startTime ||''}
        shortMonth={shortMonth ||''}
        day={String(day)}
        isToday={isToday}
      />
      
    </View>
  );
};

export default BookingsScreen;
