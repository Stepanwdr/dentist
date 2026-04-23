import { SERVICES } from "@entities/service";
import { TimeSlot } from "@shared/types/slot";
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {bookingColors as C} from "@shared/theme/Booking.colors";
import {shadow} from "@features/book-slot/lib";
import {useState} from "react";
import {useBookSlot, useEditBook} from "@features/book-slot/model/queries";
import BookSlot from "@features/book-slot/BookSlot";
import { formatDateYMD } from "@shared/lib/formatDate";
import { Dentist } from "@shared/types/dentist";
import {useRoute} from "@react-navigation/core";

export const TimeScreen: React.FC<{
  service: typeof SERVICES[0];
  onNext:  (time: string) => void;
  onBack:  () => void;
  selectedDentist: Dentist;
  setLastBook: (bookSlot: TimeSlot) => void;
}> = ({ service, onBack ,selectedDentist, setLastBook }) => {
  const route = useRoute<any>();
  const bookForEdit = route.params?.book;
  const { mutate: createBook, isPending } = useBookSlot(setLastBook )
  const { mutate: editBook, isPending: isPendingEditbook } = useEditBook(setLastBook )
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [selTime, setSelTime]   = useState<string | null>(null);

  const handleBook= () => {

  const formatedDate= formatDateYMD(selectedDate || new Date()) //YYYY-MM-DD

    if(bookForEdit){
      void editBook({
        dentistId: Number(selectedDentist?.id),
        date: formatedDate,
        serviceId: service.id,
        notes: "Зуб болит",
        startTime:slot?.startTime || '',
        endTime:slot?.endTime || '',
        service: service.label,
        id: Number(bookForEdit?.id),
      })
    }else{
      createBook({
        dentistId: Number(selectedDentist?.id),
        date: formatedDate,
        serviceId: service.id,
        notes:"Зуб болит",
        startTime:slot?.startTime || '',
        endTime:slot?.endTime || '',
        service: service.label
      })
    }

  }

  const handleSlotSelect=(date:Date,slot:TimeSlot)=>{
    setSelTime(`${slot.startTime} - ${slot.endTime}`)
    setSelectedDate(date)
    setSlot(slot)
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      <View style={[styles.timeHeader, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>
        <Text style={styles.stepLabel}>Шаг 1 of 4</Text>
      </View>
      <BookSlot
        onConfirm={handleSlotSelect}
        setSelTime={setSelTime}
        dentistId={Number(selectedDentist?.id)}
      />
      {/* Sticky CTA */}
      <View style={[styles.timeCTAWrap]}>
        <TouchableOpacity
          style={[styles.ctaBtn,( !selTime || isPending || isPendingEditbook )  && styles.ctaBtnDisabled]}
          onPress={() => selTime && handleBook()}
          disabled={!selTime || isPending || isPendingEditbook}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaTxt}>
            {selTime ? `Записаться · ${selTime}` : 'Выберите время'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const styles = StyleSheet.create({
  // ── BookingFlow / общий контейнер ──
  screen: { flex: 1, backgroundColor: C.bg },

  // ── TimeScreen: шапка с прогресс-баром ──
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: C.white,
    gap: 10,
  },
  backBtn:       { padding: 4 },
  backTxt:       { fontSize: 22, color: C.text, lineHeight: 26 },
  progressTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.border },
  progressFill:  { height: 4, borderRadius: 2, backgroundColor: C.skyTop },
  stepLabel:     { fontSize: 11, color: C.textMuted, minWidth: 56, textAlign: 'right' },

  // ── TimeScreen: CTA кнопка ──
  timeCTAWrap: {
    position: 'absolute', bottom: 62, left: 20, right: 20,
    ...shadow(C.skyTop, 0.2, 20, 0),
  },
  ctaBtn: {
    bottom: 20,
    height: 54, borderRadius: 27,
    backgroundColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.38, 16, 7),
  },
  ctaBtnDisabled: { backgroundColor: '#B0C4D8', ...shadow('#000', 0.06, 8, 3) },
  ctaTxt:         { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});
