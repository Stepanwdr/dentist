// src/widgets/booking-calendar/ui/BookingFooter.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarDay } from '@shared/lib/formatDate';
import { Colors } from '@shared/config/colors';
import { Button } from '@shared/ui';
import { useI18n } from '@shared/i18n/core';

interface BookingFooterProps {
  selectedDay: CalendarDay | undefined;
  selectedTime: string | null;
  onConfirm: () => void;
}

export const BookingFooter: React.FC<BookingFooterProps> = ({
  selectedDay,
  selectedTime,
  onConfirm,
}) => {
  const { t } = useI18n();
  const isReady = !!selectedDay && !!selectedTime;

  return (
    <View style={styles.footer}>
      {isReady && (
        <View style={styles.info}>
          <Ionicons name="calendar-outline" size={15} color={Colors.primary} />
          <Text style={styles.infoText}>
            {selectedDay.dayName}, {selectedDay.dayNum} {selectedDay.month} • {selectedTime}
          </Text>
        </View>
      )}
      <Button
        label={t('booking.confirm')}
        onPress={onConfirm}
        disabled={!isReady}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 8,
  },
  info: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
});
