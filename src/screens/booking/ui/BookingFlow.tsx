import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
} from 'react-native';
import { bookingColors as C } from "@shared/theme/Booking.colors";

import { SuccessScreen } from "@widgets/booking/ui/SuccessScreen";
import { SERVICES } from "@entities/service";
import { WEEK } from "@entities/service/model/mockData";
import { ServiceScreen } from "@widgets/booking/ui/ServiceScreen";
import { TimeScreen } from "@widgets/booking/ui/TimeScreen";
import { shadow } from "@features/book-slot/lib";
import {useRoute} from "@react-navigation/core";
import {useGetDentists} from "@entities/dentist/model/useGetDentists";
import {Dentist} from "@shared/types/dentist";
import {useFocusEffect} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {TabParamList} from "@app/navigation/types";
import {TimeSlot} from "@shared/types/slot";


interface Props {
  navigation: NativeStackNavigationProp<TabParamList, 'AppointmentsTab'>;
}
// ─── Root: BookingFlow ────────────────────────────────────
const BookingFlow: React.FC<Props> = ({navigation}) => {
  const route = useRoute<any>();
  const dentistId = route.params?.dentistId || '';
  const { data } = useGetDentists({search:""})
 const [lastBook, setLastBook]=useState<TimeSlot | null>(null);
  const selectedDentist=data?.find((d) => d.id === dentistId) || data?.[0];
  const [screen, setScreen] = useState<'services' | 'time' | 'success'>(
    dentistId ? 'time' : 'services' // 👈 если есть врач — сразу дальше
  );
  const [service, setService] = useState(SERVICES[0]);
  const [time, setTime] = useState('');
  const [day, setDay] = useState(WEEK[1]);


  useFocusEffect(
   useCallback(()=> setScreen('services'),[])
  )

  useEffect(() => {
    if (lastBook) setScreen('success');
  }, [lastBook]);


  return (
    <>
      {screen === 'services' && (
        <ServiceScreen selectedDentist={selectedDentist  || {} as Dentist} onNext={(s) => { setService(s); setScreen('time'); }} />
      )}

      {screen === 'time' && (
        <TimeScreen
          selectedDentist={selectedDentist || {} as Dentist}
          service={service}
          onNext={(t) => { setTime(t); setDay(WEEK[1]); setScreen('success'); }}
          onBack={() => setScreen('services')}
          setLastBook={setLastBook}
        />
      )}

      {screen === 'success' && (
        <SuccessScreen
          onHome={() => setScreen('services')}
          handleBooksNavigate={()=>navigation.navigate('AppointmentsTab')}
          lastBook={lastBook}
        />
      )}
    </>
  );
};


export default BookingFlow;

export const styles = StyleSheet.create({
  // ── BookingFlow / общий контейнер ──
  screen: { flex: 1, backgroundColor: C.bg },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
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
    height: 54, borderRadius: 27,
    backgroundColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.38, 16, 7),
  },
  ctaBtnDisabled: { backgroundColor: '#B0C4D8', ...shadow('#000', 0.06, 8, 3) },
  ctaTxt:         { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});