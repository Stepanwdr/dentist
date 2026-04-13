import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Patient } from '@shared/types';
import { Colors } from '@shared/theme/colors';
import type {AuthUser} from "@shared/api";

interface InfoRow {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}
const formatDate=(date:string)=>{
  return new Date(date).toLocaleDateString('en-US');
}
const buildRows = (patient: AuthUser): InfoRow[] => [
  { iconName: 'person-outline', label: 'ФИО', value: patient?.name || '' },
  { iconName: 'call-outline', label: 'Телефон', value: patient?.phone || '' },
  { iconName: 'mail-outline', label: 'Email', value: patient?.email},
  { iconName: 'gift-outline', label: 'Дата рождения', value: formatDate(patient.birthDate) },
  { iconName: 'warning-outline', label: 'Аллергии', value: patient.allergies },
];

interface PatientInfoCardProps {
  patient?: AuthUser;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patient }) => {
  const rows = buildRows(patient || {} as AuthUser);
  return (
    <View style={styles.card}>
      {rows.map((row, idx) => (
        <View key={row.label}>
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name={row.iconName} size={16} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value || '—'}</Text>
            </View>
          </View>
          {idx < rows.length - 1 && <View style={styles.sep} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  value: { fontSize: 15, fontWeight: '500', color: Colors.text },
  sep: { height: 1, backgroundColor: Colors.separator },
});
