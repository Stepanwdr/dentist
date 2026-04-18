import React, {useEffect, useRef} from "react";
import {Animated, Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {bookingColors as C} from "@shared/theme/Booking.colors";
const {  height: SH } = Dimensions.get('window');
import {shadow} from "@features/book-slot/lib";
import {TimeSlot} from "@shared/types/slot";

export const BottomSheetDetail: React.FC<{
  visible:  boolean;
  booked:  TimeSlot | null;
  onClose:  () => void;
  handleBooksNavigate:  () => void;
  startTime: string;
  shortMonth: string;
  day: string;
  isToday?: boolean;
}> = ({ visible, onClose, handleBooksNavigate,booked,startTime,shortMonth, day, isToday }) => {
  const translateY = useRef(new Animated.Value(SH)).current;
  useEffect(() => {
    Animated.spring(translateY, {
      toValue:  visible ? 0 : SH,
      useNativeDriver: true,
      tension: 65, friction: 11,
    }).start();
  }, [visible]);

  const insets = useSafeAreaInsets();

  const ROW = (icon: string, label: string, value: string) => (
    <View style={styles.sheetRow}>
      <Text style={styles.sheetRowLabel}>{icon} {label}</Text>
      <Text style={styles.sheetRowValue}>{value}</Text>
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose} >
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <Animated.View
        style={[styles.sheetCard, { paddingBottom: insets.bottom + 16, transform: [{ translateY }] }]}
      >
        {/* Handle */}
        <View style={styles.sheetHandle} />

        <Text style={styles.sheetTitle}>Детали записи</Text>

        {/* Doctor row */}
        <View style={styles.sheetDoctorRow}>
          <View style={styles.sheetAvatar}>
            <Text style={styles.sheetAvatarTxt}>ДГ</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetAvatarLabel}>{booked?.dentist?.speciality}</Text>
            <Text style={styles.sheetDoctorName}>{booked?.dentist?.name}</Text>
            {/*<Text style={styles.sheetDoctorRating}>★ 4.9 · 12 лет опыта</Text>*/}
          </View>
          <View style={styles.sheetCheckCircle}>
            <Text style={{ fontSize: 14, color: '#059669' }}>✓</Text>
          </View>
        </View>

        <View style={styles.sheetDivider} />

        {ROW('📅', 'Дата и время', ` ${shortMonth} · ${day} ·  ${startTime}`)}
        <View style={styles.sheetDivider} />
        {ROW('🦷', 'Услуга', booked?.service || '')}
        <View style={styles.sheetDivider} />
        {ROW('📱', 'Телефон', String(booked?.dentist?.phone))}
        <View style={styles.sheetDivider} />
        {ROW('🏥', 'Адрес', String(booked?.clinic?.address))}
        <View style={styles.sheetDivider} />

        {/* Actions */}
        <View style={styles.sheetActions}>
          <TouchableOpacity style={styles.sheetBtnPrimary} onPress={handleBooksNavigate} activeOpacity={0.85}>
            <Text style={styles.sheetBtnTxt}>Смотреть список</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Bottom Sheet
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 20, paddingTop: 12,
    ...shadow('#000', 0.18, 30, -10),
  },
  sheetHandle: {
    alignSelf: 'center', width: 44, height: 4, borderRadius: 2,
    backgroundColor: C.border, marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 18, fontWeight: '900', color: C.text,
    textAlign: 'center', marginBottom: 18, letterSpacing: -0.3,
  },
  sheetDoctorRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.selected, borderRadius: 16,
    padding: 14, marginBottom: 14, gap: 12,
  },
  sheetAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetAvatarTxt:   { fontSize: 14, fontWeight: '800', color: C.skyBot },
  sheetAvatarLabel: { fontSize: 10, color: C.textMuted },
  sheetDoctorName:  { fontSize: 14, fontWeight: '800', color: C.text },
  sheetDoctorRating:{ fontSize: 11, color: C.teal, marginTop: 2 },
  sheetCheckCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center',
  },
  sheetDivider: { height: 1, backgroundColor: C.border, marginVertical: 4 },
  sheetRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12,
  },
  sheetRowLabel: { fontSize: 13, color: C.textMuted, width:"30%" },
  sheetRowValue: { fontSize: 13, fontWeight: '700', color: C.text },
  sheetActions:  { flexDirection: 'row', gap: 12, marginTop: 20 },
  sheetBtnPrimary: {
    flex: 1, height: 50, borderRadius: 25,
    backgroundColor: C.skyTop, alignItems: 'center', justifyContent: 'center',
    ...shadow(C.skyTop, 0.38, 14, 6),
  },
  sheetBtnTeal: {
    flex: 1, height: 50, borderRadius: 25,
    backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center',
    ...shadow(C.teal, 0.38, 14, 6),
  },
  sheetBtnTxt: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
