import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { useAuth } from '@features/auth/model/useAuth';
import { Colors } from '@shared/theme/colors';
import {SafeAreaView} from "react-native-safe-area-context";
import { TextInput } from 'react-native';

type Props = {
  navigation: any;
};

import { Appointment } from '@shared/types';
import { AppointmentCard } from '@entities/appointment/ui/AppointmentCard';
import { DashboardStats } from './ui/dashboard/DashboardStats';
import { RecentActivityList } from './ui/dashboard/RecentActivityList';

export const DentistDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const dentistName = useMemo(() => user?.name ?? 'Доктор', [user]);
  const [query, setQuery] = useState('');

  // Демонстрационные данные Recent Activity
  const recentActivityItems = [
    { id: 'r1', name: 'Sarah Jenkins', badges: ['VIP', 'Follow-up'], lastVisit: 'LAST VISIT Oct 12, 2023', upcoming: 'Upcoming Nov 04, 10:30 AM' },
    { id: 'r2', name: 'Marcus Thorne', badges: ['Invisalign'], lastVisit: 'Sept 28, 2023', upcoming: 'Today, 02:15 PM' },
    { id: 'r3', name: 'Elena Rodriguez', badges: ['New Patient'], lastVisit: 'None', upcoming: '' },
  ];

  return (
    <SafeAreaView style={styles.safe}>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 24, fontWeight: '700', margin: 16, color: '#4A90D9' },
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
});
