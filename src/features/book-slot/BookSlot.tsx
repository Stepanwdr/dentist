import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  ActivityIndicator, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { S }                  from './BookSlot.style';
import { bookingColors as C } from '@shared/theme/Booking.colors';
import { SLOT_W }             from '@features/book-slot/lib';
import { TimeSlot }           from '@shared/types/slot';
import { SlotCell }           from './ui/SlotCell';
import { CalendarSection }    from './ui/CalendarSection';
import {
  useGetBookings,
  useGetAvailableDates,
} from '@entities/booking/model/booking.model';
import { formatDateYMD } from '@shared/lib/formatDate';
import {useRoute} from "@react-navigation/core";
import {toDayKey, normalizeDate, fromDayKey} from '@shared/utils/date';
import { generateDaySlots } from "@shared/utils/generateDaySlots";

// ─────────────────────────────────────────────────────────
// GENERATE ALL SLOTS 09:00 – 20:00 (каждые 30 мин)
// и мержим с реальными данными от API
// ─────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
type SlotPair  = { type: 'slot';   left: TimeSlot; right: TimeSlot | null };
type HeaderRow = { type: 'header'; freeCount: number; loading: boolean };
type Row = SlotPair | HeaderRow;

export interface TimeScreenProps {
  onBack?:    () => void;
  onConfirm?: (date: string, slot: TimeSlot) => void;
  dentistId:  number | null;
  minYear?:   number;
  maxYear?:   number;
  setSelTime:(time:null)=>void;
  selectedDate:string
}

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
const BookSlot: React.FC<TimeScreenProps> = ({
                                               onBack,
                                               onConfirm,
                                               dentistId,
                                               minYear   = new Date().getFullYear(),
                                               maxYear   = new Date().getFullYear() + 2,
                                               setSelTime,
                                             }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const bookForEdit = route.params?.book;
  const [date,         setDate]         = useState<Date>(normalizeDate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const todayKey = toDayKey(normalizeDate(new Date()));
  const currentTime = new Date().toTimeString().slice(0, 8);
  const futureKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return toDayKey(normalizeDate(d));
  }, []);
  const { data: available = new Set<string>() } = useGetAvailableDates({
    dentistId: dentistId,
    from: todayKey,
    to:   futureKey,
  });
  // ── Слоты из API (только реально созданные в БД) ─────
  const {
    data:      apiSlots,
    isPending: loading,
    isError,
    error,
    refetch,
  } = useGetBookings({
    date:      formatDateYMD(date),
    dentistId: dentistId || 0,
    isBusySlots : true
  });
  // ── Мержим: полная сетка 09:00–20:00 + статус из API ──
  const slots = useMemo(
    () => generateDaySlots(formatDateYMD(date), apiSlots?.slots || [], todayKey, currentTime),
    [date, apiSlots, todayKey, currentTime],
  );
  // ── Handlers ──────────────────────────────────────────
  const handleDateChange = useCallback((d: Date) => {
    setDate(d);
    setSelectedSlot(null);
  }, [bookForEdit]);

  const handleSlotPress = useCallback((slot: TimeSlot) => {
    // Игнорируем занятые и прошедшие
    if (slot.isBooked || slot.disabled) return;
    setSelectedSlot(slot);
    onConfirm?.(slot.date, slot);
  }, [date, onConfirm]);

  const selectedSlotId = selectedSlot?.id ?? null;

  // ── FlatList rows ─────────────────────────────────────
  const rows = useMemo((): Row[] => {
    const freeCount = slots.filter(s => !s.isBooked && !s.disabled).length;
    const header: HeaderRow = { type: 'header', freeCount, loading };

    const pairs: SlotPair[] = [];
    for (let i = 0; i < slots.length; i += 2) {
      pairs.push({
        type:  'slot',
        left:  slots[i],
        right: slots[i + 1] ?? null,
      });
    }

    return [header, ...pairs];
  }, [slots, loading]);

  useEffect(() => {
    setSelTime(null)
    void refetch()
  }, [date]);

  useEffect(() => {
    if (!bookForEdit) return;
    // 1. ставим дату
    const bookDate = normalizeDate(new Date(bookForEdit.date));
    setDate(bookDate);

  }, [bookForEdit]);


  const renderItem = useCallback(({ item }: { item: Row }) => {
    if (item.type === 'header') {
      if (item.loading) {
        return (
          <View style={S.center}>
            <ActivityIndicator color={C.sky} size="large" />
            <Text style={S.loadTxt}>Загружаем...</Text>
          </View>
        );
      }
      if (isError) {
        return (
          <View style={S.center}>
            <Text style={{ fontSize: 32 }}>⚠️</Text>
            <Text style={S.emptyTitle}>Ошибка загрузки</Text>
            <Text style={S.emptyTxt}>{error?.message}</Text>
            <TouchableOpacity onPress={() => refetch()} style={S.badge}>
              <Text style={S.badgeTxt}>Повторить</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <View style={S.slotsHead}>
          <Text style={S.slotsTitle}>Время</Text>
          {item.freeCount > 0 && (
            <View style={S.badge}>
              <Text style={S.badgeTxt}>{item.freeCount} свободно</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={S.slotRow}>
        <SlotCell
          slot={item.left}
          selected={item.left.id === selectedSlotId}
          onPress={handleSlotPress}
        />
        {item.right
          ? <SlotCell
            slot={item.right}
            selected={item.right.id === selectedSlotId}
            onPress={handleSlotPress}
          />
          : <View style={{ width: SLOT_W }} />
        }
      </View>
    );
  }, [selectedSlotId, handleSlotPress, isError, error, refetch]);

  const keyExtractor = useCallback((_: Row, i: number) => String(i), []);

  const ListEmpty = useCallback(() => (
    loading ? null : (
      <View style={S.center}>
        <Text style={{ fontSize: 32 }}>📅</Text>
        <Text style={S.emptyTitle}>Нет слотов</Text>
        <Text style={S.emptyTxt}>Выберите другую дату</Text>
      </View>
    )
  ), [loading]);

  return (
    <View style={S.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={[S.topBar]}>
        {onBack
          ? <TouchableOpacity onPress={onBack} style={S.backBtn} activeOpacity={0.7}>
            <Text style={S.backTxt}>‹</Text>
          </TouchableOpacity>
          : <View style={S.backBtn} />
        }
        <Text style={S.topTitle}>{bookForEdit ? 'Редактировать' : 'Записаться'}</Text>
        <View style={S.backBtn} />
      </View>

      <CalendarSection
        selectedDate={date}
        available={available}
        onDateChange={handleDateChange}
        minYear={minYear}
        maxYear={maxYear}
      />

      <FlatList
        data={rows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={selectedSlotId}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          S.content,
          { paddingBottom: insets.bottom + (selectedSlot ? 80 : 24) },
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={8}
      />
    </View>
  );
};

export default BookSlot;
