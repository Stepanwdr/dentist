// src/pages/confirmation/ui/ConfirmationPage.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors } from '@shared/config/colors';
import { formatDateFull } from '@shared/lib/formatDate';
import { useBookingStore } from '@features/booking';
import { RootStackParamList } from '@app/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Confirmation'>;
  route: RouteProp<RootStackParamList, 'Confirmation'>;
};

export const ConfirmationPage: React.FC<Props> = ({ route, navigation }) => {
  const { state } = useBookingStore();
  const apt = state.appointments.find(a => a.id === route.params.appointmentId);

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark" size={52} color={Colors.surface} />
        </Animated.View>

        <Animated.View style={[styles.content, { opacity }]}>
          <Text style={styles.title}>Запись подтверждена!</Text>
          <Text style={styles.subtitle}>
            Ждём вас в клинике. За 2 часа до приёма придёт напоминание.
          </Text>

          {apt && (
            <View style={styles.card}>
              {[
                { icon: 'medical-outline' as const, label: 'Услуга', value: apt.serviceName },
                { icon: 'person-outline' as const, label: 'Врач', value: apt.doctorName },
                {
                  icon: 'calendar-outline' as const,
                  label: 'Дата и время',
                  value: `${formatDateFull(apt.date)} в ${apt.time}`,
                },
              ].map((row, idx, arr) => (
                <View key={row.label}>
                  <View style={styles.cardRow}>
                    <Ionicons name={row.icon} size={18} color={Colors.primary} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.rowLabel}>{row.label}</Text>
                      <Text style={styles.rowValue}>{row.value}</Text>
                    </View>
                  </View>
                  {idx < arr.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          )}

          <View style={styles.addressCard}>
            <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.addressLabel}>Адрес клиники</Text>
              <Text style={styles.addressValue}>ул. Ленина, 42, каб. 301</Text>
            </View>
            <View style={styles.mapBtn}>
              <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity }]}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Services' }] })}
        >
          <Text style={styles.secondaryBtnText}>На главную</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.getParent()?.navigate('AppointmentsTab')}
        >
          <Text style={styles.primaryBtnText}>Мои записи</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.surface} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 48 },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.success,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
    shadowColor: Colors.success, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  content: { width: '100%', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: Colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21, marginBottom: 24, paddingHorizontal: 12 },
  card: {
    width: '100%', backgroundColor: Colors.surface, borderRadius: 16,
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  rowLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  rowValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.separator },
  addressCard: {
    width: '100%', backgroundColor: Colors.surface, borderRadius: 14,
    padding: 14, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  addressLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  addressValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  mapBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  footer: { flexDirection: 'row', gap: 12, padding: 20, paddingBottom: 32 },
  secondaryBtn: {
    flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  primaryBtn: {
    flex: 1, borderRadius: 14, paddingVertical: 14,
    backgroundColor: Colors.primary, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: Colors.surface },
});
