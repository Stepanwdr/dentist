import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";
import {normalizeDate, toDayKey} from "@shared/utils/date";
import {CalendarSection} from "@features/book-slot/ui/CalendarSection";
import {useGetAvailableDates} from "@entities/booking/model/booking.model";
import { HomeColor } from "@shared/theme/home";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Tabs} from "@shared/ui/Tabs";
import {Appointment} from "@shared/types";


export const appointments= [
  // FREE
  { id: '1', time: '09:00', status: 'free' },
  { id: '2', time: '09:30', status: 'free' },

  // PENDING
  {
    id: '3',
    time: '10:00',
    patient: 'Eleanor Shellstrop',
    type: 'Consultation',
    status: 'pending',
  },
  {
    id: '4',
    time: '10:30',
    patient: 'Chidi Anagonye',
    type: 'Teeth Cleaning',
    status: 'pending',
  },

  // BOOKED
  {
    id: '5',
    time: '11:00',
    patient: 'Tahani Al-Jamil',
    type: 'Whitening',
    status: 'booked',
  },
  {
    id: '6',
    time: '11:30',
    patient: 'Jason Mendoza',
    type: 'Cavity Filling',
    status: 'booked',
  },
  {
    id: '7',
    time: '12:00',
    patient: 'Eleanor Shellstrop',
    type: 'Root Canal Follow-up',
    status: 'booked',
  },

  // BLOCKED
  {
    id: '8',
    time: '12:30',
    status: 'blocked',
  },
  {
    id: '9',
    time: '13:00',
    status: 'blocked',
  },

  // MIX дальше
  { id: '10', time: '13:30', status: 'free' },

  {
    id: '11',
    time: '14:00',
    patient: 'Michael',
    type: 'Implant Consultation',
    status: 'pending',
  },

  {
    id: '12',
    time: '14:30',
    patient: 'Janet',
    type: 'Check-up',
    status: 'booked',
  },

  {
    id: '13',
    time: '15:00',
    status: 'blocked',
  },

  { id: '14', time: '15:30', status: 'free' },
];
export type AppointmentsTab =
  | 'free'
  | 'booked'
  | 'blocked'
  | 'pending' | 'all';

const tabs:{label:string,value:AppointmentsTab}[] = [
  { label: 'Все', value: 'all' },
  { label: 'Свободно', value: 'free' },
  { label: 'В ожидании', value: 'pending' },
  { label: 'Забронирован', value: 'booked' },
  { label: 'Закрыт', value: 'blocked' },
];


const SlotItem = ({ time, patient, type, status, onAction }) => {
  const isAvailable = status === 'free';
  const isBlocked = status === 'blocked';
  const isPending = status === 'pending';
  const isActive = status === 'booked';
  return (
    <View style={[styles.slotContainer, isBlocked && styles.slotBlocked]}>
     <View style={styles.timeContainer}>
       <Text style={{textAlign:"center"}}> {time} </Text>
     </View>
      <View style={styles.contentSection}>
        {isAvailable ? (
          <View style={styles.availableRow}>
            <Text style={styles.availableText}>Пациент не назначено</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.btnAssign} onPress={() => onAction('ASSIGN')}>
                <Ionicons name="person-add-outline" size={16} color={HomeColor.primary} />
                <Text style={styles.btnTextPrimary}>Назначить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnClose} onPress={() => onAction('CLOSE')}>
                <Ionicons name="lock-closed-outline" size={16} color={HomeColor.pink} />
                <Text style={styles.btnTextSecondary}>Закрыть слот</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isBlocked ? (
          <View style={styles.blockedRow}>
            <View>
              <Text style={styles.blockedTitle}>Slot Unavailable</Text>
              <Text style={styles.blockedSub}>Staff Break / Maintenance</Text>
            </View>
            <TouchableOpacity style={styles.btnOpen} onPress={() => onAction('OPEN')}>
              <MaterialCommunityIcons name="lock-open-outline" size={16} color={HomeColor.textSub} />
              <Text style={styles.btnOpenText}>Открыть</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.patientRow}>
            <View>
              <Text style={styles.patientName}>{patient}</Text>
              <View style={styles.typeRow}>
                <View style={[styles.typeDot, { backgroundColor: HomeColor.teal }]} />
                <Text style={styles.typeText}>{type}</Text>
              </View>
            </View>
            {isPending && <View style={styles.actions}>
              <TouchableOpacity style={styles.btnApprove} onPress={() => onAction('OPEN')}>
               <Ionicons name="checkmark-outline" size={16} color={HomeColor.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnIgnore} onPress={() => onAction('OPEN')}>
                <Ionicons name="close-outline" size={16} color={HomeColor.white} />
              </TouchableOpacity>
            </View>}
          </View>
        )}
      </View>
    </View>

  );
};

export default function ScheduleScreen() {
  const [date,         setDate]         = useState<Date>(normalizeDate(new Date()));
  const [tab,  setTab]  = useState<AppointmentsTab>('all');
  const todayKey = toDayKey(normalizeDate(new Date()));
  const currentTime = new Date().toTimeString().slice(0, 8);
  const futureKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return toDayKey(normalizeDate(d));
  }, []);
  const { data: available = new Set<string>() } = useGetAvailableDates({
    dentistId: 5,
    from: todayKey,
    to:   futureKey,
  });
  const  minYear = 2026
  const  maxYear = 2060

  const handleDateChange = () => {
    setDate(normalizeDate(new Date()));
  }

  const handleTabChange = () => {}
  const filteredBooks=tab === 'all' ? appointments : appointments.filter(item=>item.status === tab)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Расписание слотов</Text>
      <View style={styles.calendarSection}>
        <CalendarSection
          selectedDate={date}
          available={available}
          onDateChange={handleDateChange}
          minYear={minYear}
          maxYear={maxYear}
        />
      </View>
      <View style={{ marginVertical: 4 }}>
        <Tabs<AppointmentsTab> active={tab} onChange={setTab} tabs={tabs} />
      </View>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredBooks.map(item =>
          <SlotItem onAction={handleTabChange} key={item.id}
          time={item.time}
          patient={item.patient}
          type={item.type}
          status={item.status}
        />)}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: bookingColors.bg,
    padding: 16,
    paddingTop:25,
    borderRadius: 24,
  },
  calendarSection:{
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
  list:{
    marginVertical: 16,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: HomeColor.white, padding: 16, borderRadius: 24, flexDirection: 'row', alignItems: 'center' },
  statIcon: { padding: 8, borderRadius: 12, marginRight: 12 },
  statLabel: { fontSize: 12, color: HomeColor.primary, fontWeight: '600' },
  statValue: { fontSize: 24, fontWeight: '800', color: HomeColor.text },
  statSub: { fontSize: 8, color: HomeColor.textMuted, fontWeight: 'bold' },

  listContent: {  paddingBottom: 450 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: HomeColor.text, marginBottom: 16, marginTop: 8 },

  slotContainer: { backgroundColor: HomeColor.white, borderRadius: 24, padding: 16, flexDirection: 'row', marginBottom: 12, minHeight: 90,alignItems:"center",overflow:'hidden',paddingLeft:80 },
  timeContainer: {
    borderRadius: 24,
    backgroundColor: HomeColor.bg,
    height: 100,
    textAlign: "center",
    position: 'absolute',
    width: '25%',
    justifyContent:"center",
  },
  slotBlocked: { backgroundColor: 'rgba(255,255,255,0.5)', borderStyle: 'dashed', borderWidth: 1, borderColor: HomeColor.border },
  timeSection: { width: 60, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: HomeColor.bg },
  timeText: { fontSize: 18, fontWeight: '800', color: HomeColor.primaryDark },
  timeAmPm: { fontSize: 10, color: HomeColor.textMuted, fontWeight: 'bold' },

  contentSection: { flex: 1, paddingLeft: 16, justifyContent: 'center' },
  patientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 16, fontWeight: '700', color: HomeColor.text },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  typeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  typeText: { fontSize: 12, color: HomeColor.textSub },

  availableRow: { flexDirection: 'column' },
  availableText: { fontSize: 14, color: HomeColor.textMuted, marginBottom: 8, fontStyle: 'italic' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  btnAssign: { backgroundColor: HomeColor.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,flexDirection:"row",alignItems: "center", justifyContent: "center",gap:5 },
  btnClose: { backgroundColor: HomeColor.pinkLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,flexDirection:"row",gap:5,alignItems:"center", justifyContent: "center" },
  btnTextPrimary: { color: HomeColor.primaryDark, fontWeight: 'bold', fontSize: 12 },
  btnTextSecondary: { color: HomeColor.pink, fontWeight: 'bold', fontSize: 12 },
  btnApprove:{backgroundColor:HomeColor.pink,color:HomeColor.white,borderRadius:30,paddingHorizontal:10,paddingVertical:10,maxWidth:100,textAlign:"center"},
  btnIgnore:{backgroundColor:HomeColor.primary,color:HomeColor.white,borderRadius:30,paddingHorizontal:10,paddingVertical:10,maxWidth:100,textAlign:"center"},
  blockedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  blockedTitle: { fontSize: 14, color: HomeColor.textMuted, fontWeight: '600' },
  blockedSub: { fontSize: 11, color: HomeColor.textMuted },
  btnOpen: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: HomeColor.border, borderRadius: 12 },
  btnOpenText: { fontSize: 12, color: HomeColor.textSub, marginLeft: 4, fontWeight: 'bold' },
  actions:{
    flexDirection: 'row',
    maxWidth:100,
    alignItems:'center',
    gap:5
  },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 64, height: 64, borderRadius: 32, backgroundColor: HomeColor.pink, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: HomeColor.pink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }
});