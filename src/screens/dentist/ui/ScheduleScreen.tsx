import React, {useCallback, useMemo, useState} from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { bookingColors } from "@shared/theme/Booking.colors";
import { normalizeDate, toDayKey } from "@shared/utils/date";
import { CalendarSection } from "@features/book-slot/ui/CalendarSection";
import { useGetAvailableDates, useGetBookings } from "@entities/booking/model/booking.model";
import { HomeColor } from "@shared/theme/home";
import { Tabs } from "@shared/ui/Tabs";
import { useMeQuery } from "@shared/api";
import { formatDateYMD } from "@shared/lib/formatDate";
import { generateDaySlots } from "@shared/utils/generateDaySlots";
import { useCreateScheduleBlock, useDeleteScheduleBlock, useScheduleBlocks } from "@entities/schedule-block";
import { buildScheduleData, ScheduleItem } from "@shared/utils/buildScheduleData";
import {useChangeBookingStatus} from "@features/change-book-status/model";
import {useConfirmBookStatus} from "@features/confirm-book/model";
import {ActionType, AppointmentsTab, SlotItem} from "@screens/dentist/ui/SlotItem";
import {AsignData, PatientAsignDrawer} from "@features/patient-asign/ui/PatientAsignDrawer";
import {useFocusEffect} from "@react-navigation/native";

const tabs:{label:string,value:AppointmentsTab}[] = [
  { label: 'Все', value: 'all' },
  { label: 'Свободно', value: 'free' },
  { label: 'В ожидании', value: 'pending' },
  { label: 'Забронирован', value: 'booked' },
  { label: 'Закрыт', value: 'blocked' },
];

export default function ScheduleScreen() {
  const [date, setDate] = useState<Date>(normalizeDate(new Date()));
  const [tab, setTab] = useState<AppointmentsTab>('all');
  const [asignData,setAsignData]=useState<AsignData | null>(null)

  const { data } = useMeQuery();
 const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dentistId = data?.id
  const selectedDate = formatDateYMD(date);
  const todayKey = toDayKey(normalizeDate(new Date()));
  const currentTime = new Date().toTimeString().slice(0, 8);

  const futureKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return toDayKey(normalizeDate(d));
  }, []);

  const { data: bookingsData,refetch } = useGetBookings({
    date: selectedDate,
    dentistId,
    isBusySlots:true
  });
  const { data: blocksData,refetch:refetchSchedule } = useScheduleBlocks({
    dentistId,
    date: selectedDate,
  });
  const { mutate: createBlock } = useCreateScheduleBlock();
  const { mutate: deleteBlock } = useDeleteScheduleBlock();

  const { mutate: onCancelBook } = useChangeBookingStatus(refetch)

  const { mutate: onConfirmBook } = useConfirmBookStatus(refetch)

  const slots = useMemo(
    () => generateDaySlots(selectedDate, bookingsData?.slots || [], todayKey, currentTime),
    [selectedDate, bookingsData?.slots, todayKey, currentTime],
  );

  const scheduleData = useMemo(
    () => buildScheduleData(slots, blocksData?.blocks || []),
    [slots, blocksData?.blocks],
  );

  const { data: available = new Set<string>() } = useGetAvailableDates({
    dentistId: data?.dentistId || 0,
    from: todayKey,
    to: futureKey,
  });

  const handleDateChange = (nextDate: Date) => {
    setDate(normalizeDate(nextDate));
  };

const handleAction=(action:ActionType,slot: ScheduleItem)=>{
  const _id=String(slot.id)
  if (action ==='CONFIRM') {
    const bookId= _id.replace('booking-','');
      onConfirmBook({id:Number(bookId)})
  }
  if (action ==='CANCEL') {
    const bookId=_id.replace('booking-','');
    onCancelBook({id:Number(bookId),status:'cancelled'})
  }

  if (action ==='CLOSE') {
    const startTime= _id.replace('free-','');
    const slot = slots.find((item) => item.startTime === startTime);
    if (!slot || !dentistId) return;

    createBlock({
      dentistId,
      date: selectedDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      type: 'manual',
    });
  }
  if (action ==='OPEN') {
    const startTime= _id.replace('blocked-','');
    const slot = slots.find((item) => item.startTime === startTime);
    if (!slot) return;

    const block = blocksData?.blocks?.find((item) =>
      item.startTime < slot.endTime && item.endTime > slot.startTime
    );

    if (!block) return;
    deleteBlock(block.id);
  }

  if (action ==='ASSIGN') {
    setAsignData(prevState => ({...prevState,time:slot.time, date: toDayKey(date)}) as AsignData);
    setIsDrawerOpen(true);
  }

}
  const filteredBooks = tab === 'all'
    ? scheduleData
    : scheduleData.filter((item) => item.status === tab);


const onDrawerClose=()=>{
  setIsDrawerOpen(false);
  setAsignData(null);
}

useFocusEffect(useCallback(()=> {
  void refetchSchedule
  void refetch
},[]))
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Расписание слотов</Text>
      <View style={styles.calendarSection}>
        <CalendarSection
          selectedDate={date}
          available={available}
          onDateChange={handleDateChange}
          minYear={2026}
          maxYear={2060}
        />
      </View>
      <View style={{ marginVertical: 4 }}>
        <Tabs<AppointmentsTab> active={tab} onChange={setTab} tabs={tabs} />
      </View>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredBooks.map((item) => (
          <SlotItem
            onAction={(action)=> handleAction(action,item)}
            key={item.id}
            time={item.time}
            patient={item.patient}
            service={item.service}
            status={item.status}
            id={item.id}
          />
        ))}
      </ScrollView>
      <PatientAsignDrawer
        isDrawerOpen={isDrawerOpen}
        onDrawerClose={onDrawerClose}
        setAsignData={setAsignData}
        asignData={asignData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: bookingColors.bg,
    padding: 16,
    paddingTop: 25,
    borderRadius: 24,
  },
  calendarSection: {
    borderRadius: 24,
    backgroundColor: bookingColors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: bookingColors.sky,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  time: {
    width: 60,
    color: bookingColors.textMuted,
  },
  list: {
    marginVertical: 16,
  },
  listContent: { paddingBottom: 450 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: HomeColor.text, marginBottom: 16, marginTop: 8 },
  contentSection: { flex: 1, paddingLeft: 16, justifyContent: 'center' },
  patientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 16, fontWeight: '700', color: HomeColor.text },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  typeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  typeText: { fontSize: 12, color: HomeColor.textSub },
  blockedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
