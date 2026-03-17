// src/widgets/patient-profile/ui/PatientHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Patient } from '@shared/types';
import { Colors } from '@shared/config/colors';

interface PatientHeaderProps {
  patient: Patient;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const initials = patient.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <Text style={styles.name}>{patient.name}</Text>
      <Text style={styles.phone}>{patient.phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 20 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  initials: { fontSize: 30, fontWeight: '700', color: Colors.surface },
  name: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  phone: { fontSize: 14, color: Colors.textSecondary },
});
