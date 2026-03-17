// src/features/booking/ui/DayPicker.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CalendarDay } from '@shared/lib/formatDate';
import { Colors } from '@shared/config/colors';

interface DayPickerProps {
  days: CalendarDay[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}

export const DayPicker: React.FC<DayPickerProps> = ({ days, selectedKey, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.row}
  >
    {days.map(day => {
      const isSelected = selectedKey === day.key;
      return (
        <TouchableOpacity
          key={day.key}
          style={[
            styles.day,
            isSelected && styles.daySelected,
            day.isWeekend && !isSelected && styles.dayWeekend,
          ]}
          onPress={() => onSelect(day.key)}
        >
          <Text style={[styles.dayName, isSelected && styles.selectedText]}>
            {day.isToday ? 'Сег' : day.dayName}
          </Text>
          <Text style={[styles.dayNum, isSelected && styles.selectedText]}>
            {day.dayNum}
          </Text>
          <Text style={[styles.dayMonth, isSelected && styles.selectedMonthText]}>
            {day.month}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: { gap: 8, paddingBottom: 4, paddingRight: 8 },
  day: {
    width: 58,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  daySelected: { backgroundColor: Colors.primary },
  dayWeekend: { backgroundColor: '#FFF5F5' },
  dayName: { fontSize: 11, color: Colors.textMuted, marginBottom: 4, fontWeight: '500' },
  dayNum: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  dayMonth: { fontSize: 10, color: Colors.textMuted },
  selectedText: { color: Colors.surface },
  selectedMonthText: { color: '#ffffffaa' },
});
