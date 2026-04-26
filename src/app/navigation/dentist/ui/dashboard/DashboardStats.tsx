import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@shared/theme/colors';

type Props = {
  totalPatients: number;
  todaysVisits: number;
};

export const DashboardStats: React.FC<Props> = ({ totalPatients, todaysVisits }) => {
  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: Colors.primary }]}> 
        <Text style={styles.value}>{totalPatients.toLocaleString()}</Text>
        <Text style={styles.label}>Total Patients</Text>
      </View>
      <View style={[styles.card, { backgroundColor: Colors.surface }]}>
        <Text style={[styles.value, { color: Colors.primary }]}>{todaysVisits}</Text>
        <Text style={[styles.label, { color: Colors.text }]}>Today's Visits</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#fff',
    marginTop: 6,
  },
});
