import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useAuth } from '@features/auth/model/useAuth';
import { Colors } from '@shared/theme/colors';


type Props = {
  navigation: any;
};

import { BookingStats } from './ui/dashboard/BookingStats';
import { DashboardOverview } from './ui/dashboard/DashboardOverview';
import { QueueList } from './ui/dashboard/QueueList';
import {NextBookCard} from "@app/navigation/dentist/ui/dashboard/NextBookCard";

export const DentistDashboard: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const dentistName = useMemo(() => user?.name ?? 'Доктор', [user]);
  const [query, setQuery] = useState('');

  // Демонстрационные данные Recent Activity
  const recentActivityItems = [
    { id: 'r1', name: 'Sarah Jenkins', badges: ['VIP', 'Follow-up'], lastVisit: 'LAST VISIT Oct 12, 2023', upcoming: 'Upcoming Nov 04, 10:30 AM' },
    { id: 'r2', name: 'Marcus Thorne', badges: ['Invisalign'], lastVisit: 'Sept 28, 2023', upcoming: 'Today, 02:15 PM' },
    { id: 'r3', name: 'Elena Rodriguez', badges: ['New Patient'], lastVisit: 'None', upcoming: '' },
  ];

  const queueItems = [
    { id: 'q1', name: 'Marcus Knight', time: '11:00' },
    { id: 'q2', name: 'Julian Rossi', time: '11:15' },
  ];

  return (
    <View style={styles.safe}>
      <DashboardOverview doctorName={dentistName} greeting={'Привет ДР.'} />
      <BookingStats totalCompleted={1284} totalWait={18} totalConfirmed={2} />
      <Text style={styles.title}>
       Следующий запись
      </Text>
      <NextBookCard/>
      <Text style={styles.title}>
        В очередь
      </Text>
      <QueueList items={queueItems as any} />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background,marginTop:30,padding:16, },
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
