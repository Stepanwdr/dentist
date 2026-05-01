import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import { useAuth } from '@features/auth/model/useAuth';
import { Colors } from '@shared/theme/colors';


type Props = {
  navigation: any;
};

import { BookingStats } from './ui/dashboard/BookingStats';
import { DashboardOverview } from './ui/dashboard/DashboardOverview';
import { QueueList } from './ui/dashboard/QueueList';

import {BottomSheetDetail} from "@features/book-slot/ui/BottomSheetDetail";
import {useGetBooking, useGetBookings} from "@entities/booking/model/booking.model";
import {toDayKey} from "@shared/utils/date";
import { NextBookCard } from "./ui/dashboard/NextBookCard";

export const DentistDashboard: React.FC<Props> = () => {
  const { user } = useAuth();
  const [sheet, setSheet] = useState(false);
  const [bookId,setBookId]=useState<number | null>(null);
  const today=toDayKey(new Date());
  const { data: bookingsData, refetch, isPending, isRefetching } = useGetBookings({ status: 'upcoming', date:today });
  const { data: selectedBookData } = useGetBooking(bookId || undefined);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const dentistName = useMemo(() => user?.name ?? 'Доктор', [user]);
  const [query, setQuery] = useState('');
  const { startTime, shortMonth, day, isToday } = useMemo(() => {
    if (!selectedBookData?.startTime) return {};

    const date = new Date(selectedBookData.date);
    const today = new Date();
    return {
      startTime: selectedBookData.startTime,
      shortMonth: date.toLocaleString('en', { month: 'short' }), // May
      day: date.getDate(), // 24
      isToday: date.getDate() === today.getDate()
    };
  }, [selectedBookData]);

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

  return (
    <View style={styles.safe}>
      <DashboardOverview doctorName={dentistName} greeting={'Привет ДР.'} />
      <BookingStats totalCompleted={bookingsData?.stats.completed || 0} totalWait={bookingsData?.stats.pending || 0} totalConfirmed={bookingsData?.stats.confirmed || 0} />
      <Text style={styles.title}>
       Следующий запись
      </Text>
      <NextBookCard setBookId={setBookId}/>
      <Text style={styles.title}>
        В очередь
      </Text>
      <QueueList  setBookId={setBookId} />
      <BottomSheetDetail
        visible={sheet}
        booked={selectedBookData || null}
        onClose={()=> setBookId(null)}
        startTime={startTime ||''}
        shortMonth={shortMonth ||''}
        day={String(day)}
        isToday={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background,marginTop:30, padding:16, paddingTop:0},
  title: { fontSize: 18, fontWeight: '700', margin: 16, color: '#4A90D9' },
  searchRow: { paddingHorizontal: 16, paddingVertical: 6 },
  searchInput: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  section: {  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 6 },
  cardSub: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cardSubtitle: { fontSize: 12, color: Colors.textMuted },
  // Next card block styles (layout below the queue)
  nextCard: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  nextTitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 4 },
  nextText: { fontSize: 16, fontWeight: '700', color: Colors.text },

});
