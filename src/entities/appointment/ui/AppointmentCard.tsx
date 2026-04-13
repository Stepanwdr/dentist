// src/entities/appointment/ui/AppointmentCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '@shared/types';
import { Colors } from '@shared/theme/colors';
import { Badge } from '@shared/ui';
import { STATUS_CONFIG } from '../model/statusConfig';
import { formatDateShort } from '@shared/lib/formatDate';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReview?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onReview,
}) => {
  const cfg = STATUS_CONFIG[appointment.status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Badge
          label={cfg.label}
          color={cfg.color}
          bg={cfg.bg}
          iconName={cfg.iconName}
        />
        <Text style={styles.dateText}>
          {formatDateShort(appointment.date)}, {appointment.time}
        </Text>
      </View>

      <Text style={styles.serviceName}>{appointment.serviceName}</Text>

      <View style={styles.doctorRow}>
        <Ionicons name="person-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.doctorName}>{appointment.doctorName}</Text>
      </View>

      {appointment.status === 'upcoming' && onCancel && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.rescheduleBtn}>
            <Ionicons name="calendar-outline" size={15} color={Colors.primary} />
            <Text style={styles.rescheduleBtnText}>Перенести</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onCancel(appointment.id)}
          >
            <Text style={styles.cancelBtnText}>Отменить</Text>
          </TouchableOpacity>
        </View>
      )}

      {appointment.status === 'completed' && onReview && (
        <TouchableOpacity
          style={styles.reviewBtn}
          onPress={() => onReview(appointment.id)}
        >
          <Ionicons name="star-outline" size={15} color={Colors.warning} />
          <Text style={styles.reviewBtnText}>Оставить отзыв</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  serviceName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  doctorName: { fontSize: 13, color: Colors.textSecondary },
  actions: { flexDirection: 'row', gap: 10 },
  rescheduleBtn: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  rescheduleBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  reviewBtnText: { fontSize: 13, fontWeight: '600', color: '#D97706' },
});
