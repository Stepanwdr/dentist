import {Text, View, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import {Drawer, DrawerRef} from "@shared/ux/Drawer";
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {TimeSlot} from "@shared/types/slot";
import {useEditBook} from "@features/book-slot/model/queries";
import {CalendarSection} from "@features/book-slot/ui/CalendarSection";
import {normalizeDate, toDayKey} from "@shared/utils/date";
import {bookingKeys, useGetAvailableDates, useGetBookings} from "@entities/booking/model/booking.model";
import {formatDateYMD} from "@shared/lib/formatDate";
import {useScheduleBlocks} from "@entities/schedule-block";
import {bookingColors, bookingColors as C} from "@shared/theme/Booking.colors";
import {shadow} from "@features/book-slot/lib";
import {generateDaySlots} from "@shared/utils/generateDaySlots";
import {buildScheduleData } from "@shared/utils/buildScheduleData";
import {addMinutesToTime} from "@shared/utils/addMinutesToTime";
import {queryClient} from "@shared/api";

interface Props {
  bookId: string;
  close: () => void;
  book: TimeSlot | null;
}

const now = new Date();

const currentTime = now.toTimeString().slice(0, 8);
const {  height: SH } = Dimensions.get('window');

export const EditBookDrawer:FC<Props> = ({bookId,close,book}) => {
  const [date,         setDate]         = useState<Date>(normalizeDate(new Date()));
  const { mutate: editBook, isPending: isPendingEditbook } = useEditBook(successCb)
  const todayKey = toDayKey(normalizeDate(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startTime, setStartTime] = useState(book?.startTime || '');
  const drawerRef = useRef<DrawerRef>(null);
  const [endTime, setEndTime] = useState('');
  const { data: blocksData } = useScheduleBlocks({
    dentistId: book?.dentistId  || 0,
    date: formatDateYMD(date),
  });

  const {
    data:      apiSlots,
    isPending: loading,
    isError,
    error,
    refetch,
  } = useGetBookings({
    date:      formatDateYMD(date),
    isBusySlots : true,
    dentistId: book?.dentistId || 0,
  });

  // ── Мержим: полная сетка 09:00–20:00 + статус из API ──
  const slots = useMemo(
    () => generateDaySlots(
      formatDateYMD(date),
      apiSlots?.slots || [],
      todayKey,
      currentTime,
      blocksData?.blocks || [],
    ),
    [date, apiSlots, todayKey, currentTime, blocksData?.blocks],
  );
  const futureKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return toDayKey(normalizeDate(d));
  }, []);

  const { data: available = new Set<string>() } = useGetAvailableDates({
    dentistId: book?.dentistId || null,
    from: todayKey,
    to:   futureKey,
  });

  const scheduleData = useMemo(
    () => buildScheduleData(slots, blocksData?.blocks || []),
    [slots, blocksData?.blocks],
  );
  const handleDateChange = useCallback((d: Date) => {
    setDate(d);
    setSelectedDate( formatDateYMD(d))
  }, [book]);

  const handleStartTimeSelect = ( time:string) => {
    setStartTime(time);
  };

  const handleEndTimeSelect = ( time:string) => {
    setEndTime(time);
  };

  async function successCb(){
    close()
    drawerRef.current?.close()
    await queryClient.invalidateQueries({
      queryKey: ['bookings'],
    });
  }
  const handleSaveEdit= async () => {
    void editBook({
      patientId: Number(book?.patient?.id),
      date: selectedDate,
      serviceId: '',
      notes: "Зуб болит",
      startTime:startTime || '',
      endTime: addMinutesToTime(startTime,60) || '',
      service: book?.service || '',
      id: Number(book?.id),
    })
  }
  const startTimes= scheduleData.map(item=>item.time)

  useEffect(() => {
      if(bookId)drawerRef.current?.open()
  }, [bookId]);

  return (
    <Drawer ref={drawerRef}  onClose={close} gestureEnabled>
      <View style={styles.body}>
        <Text style={styles.title}>Редактировать запись</Text>
        <View>
          <CalendarSection
            selectedDate={date}
            available={available}
            onDateChange={handleDateChange}
            minYear={new Date().getFullYear()}
            maxYear={new Date().getFullYear() + 2}
          />
          <View>
            <Text style={styles.label}>Время начало</Text>
          </View>
          <View style={styles.slots}>
            {startTimes.map((time) => {
              const isSelected=`${time}:00`=== startTime
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.slotBtn, isSelected && styles.selected]}
                  onPress={()=> handleStartTimeSelect(`${time}:00`)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.slotBtnTxt,isSelected && styles.selectedTxt]}>
                    {time}
                  </Text>
                </TouchableOpacity>)
            })}

          </View>
        </View>
          <TouchableOpacity
            style={[styles.ctaBtn, isPendingEditbook  && styles.ctaBtnDisabled,{bottom: SH - (SH / 2) }]}
            onPress={handleSaveEdit}
            disabled={ isPendingEditbook}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaTxt}>
              Сохранить
            </Text>
          </TouchableOpacity>
      </View>
    </Drawer>
  );
};

const styles=StyleSheet.create({
  body: {
    gap:10,
    flex:1,
    position:'relative'
  },
  ctaTxt:         { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },

  title:{
    fontSize:18,
    fontWeight:'bold',
    position:'static',
  },
  ctaBtnDisabled: { backgroundColor: '#B0C4D8', ...shadow('#000', 0.06, 8, 3) },

  ctaBtn: {
    height: 54, borderRadius: 27,
    backgroundColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.38, 16, 7),
    marginTop:'auto',
  },

  slots:{
    flexDirection:"row",
    flexWrap:"wrap",
    gap:10
  },
  slotBtn:{
    backgroundColor:bookingColors.skyLight,
    padding:10,
    alignItems:"center",
    borderRadius:24,
    paddingHorizontal:20
  },
  slotBtnTxt:{
    textAlign:'center'
  },
  selected:{
    backgroundColor:bookingColors.sky,
  },
  selectedTxt:{
    color:'white'
  },
  label:{
    fontSize: 18,
    marginVertical: 10
  }
})