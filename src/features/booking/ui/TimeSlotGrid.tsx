// src/features/booking/ui/TimeSlotGrid.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@shared/theme/colors';

interface TimeSlotGridProps {
  slots: string[];
  busySlots: string[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  busySlots,
  selectedSlot,
  onSelect,
}) => (
  <View>
    <View style={styles.grid}>
      {slots.map(slot => {
        const isBusy = busySlots.includes(slot);
        const isSelected = selectedSlot === slot;
        return (
          <TouchableOpacity
            key={slot}
            style={[
              styles.slot,
              isBusy && styles.slotBusy,
              isSelected && styles.slotSelected,
            ]}
            onPress={() => !isBusy && onSelect(slot)}
            disabled={isBusy}
          >
            <Text
              style={[
                styles.slotText,
                isBusy && styles.slotTextBusy,
                isSelected && styles.slotTextSelected,
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    <View style={styles.legend}>
      {[
        { label: 'Свободно', bg: Colors.surface, border: Colors.border },
        { label: 'Выбрано', bg: Colors.primary, border: Colors.primary },
        { label: 'Занято', bg: Colors.separator, border: Colors.separator, crossed: true },
      ].map(item => (
        <View key={item.label} style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: item.bg, borderColor: item.border, borderWidth: 1 },
            ]}
          />
          <Text
            style={[
              styles.legendText,
              item.crossed && { textDecorationLine: 'line-through', color: Colors.textDisabled },
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  slot: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  slotSelected: { backgroundColor: Colors.primary },
  slotBusy: { backgroundColor: Colors.separator, shadowOpacity: 0, elevation: 0 },
  slotText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  slotTextSelected: { color: Colors.surface },
  slotTextBusy: { color: Colors.textDisabled, textDecorationLine: 'line-through' },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 4 },
  legendText: { fontSize: 12, color: Colors.textSecondary },
});
