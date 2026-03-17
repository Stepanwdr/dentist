// src/entities/doctor/ui/DoctorCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '@shared/types';
import { Colors } from '@shared/config/colors';
import { Avatar } from '@shared/ui';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => (
  <View style={styles.card}>
    <Avatar initials={doctor.initials} color={doctor.avatarColor} size={64} />

    <View style={styles.info}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.spec}>{doctor.specialization}</Text>

      <View style={styles.badges}>
        <View style={styles.badge}>
          <Ionicons name="briefcase-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.badgeText}>{doctor.experience} опыта</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="chatbubble-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.badgeText}>{doctor.reviewsCount} отзывов</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.rating}>
          <Ionicons name="star" size={13} color={Colors.warning} />
          <Text style={styles.ratingText}>{doctor.rating}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => onPress(doctor)}>
          <Text style={styles.btnText}>Выбрать</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  spec: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.separator,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 12, color: Colors.textSecondary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  btnText: { color: Colors.surface, fontSize: 13, fontWeight: '700' },
});
