// src/widgets/appointments-list/ui/AppointmentsTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@shared/config/colors';

export type AppointmentsTab = 'upcoming' | 'history';

interface AppointmentsTabsProps {
  active: AppointmentsTab;
  upcomingCount: number;
  onChange: (tab: AppointmentsTab) => void;
}

export const AppointmentsTabs: React.FC<AppointmentsTabsProps> = ({
  active,
  upcomingCount,
  onChange,
}) => (
  <View style={styles.tabs}>
    {(['upcoming', 'history'] as AppointmentsTab[]).map(tab => {
      const isActive = active === tab;
      const label = tab === 'upcoming' ? 'Предстоящие' : 'История';
      return (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, isActive && styles.tabActive]}
          onPress={() => onChange(tab)}
        >
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
            {label}
          </Text>
          {tab === 'upcoming' && upcomingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{upcomingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  tabTextActive: { fontWeight: '700', color: Colors.text },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: Colors.surface, fontSize: 11, fontWeight: '700' },
});
