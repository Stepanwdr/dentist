import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { s } from '../BookingScreen.styles';

export type AppointmentsTab = 'upcoming' | 'finished' | 'cancelled';

interface AppointmentsTabsProps {
  active:         AppointmentsTab;
  upcomingCount:  number;
  completedCount: number;
  onChange:       (tab: AppointmentsTab) => void;
}

export const BookingTabs: React.FC<AppointmentsTabsProps> = ({
   active, upcomingCount, completedCount, onChange,
}) => (
  <View style={s.tabBar}>
    <TabButton
      label="Предстоящие"
      count={upcomingCount}
      active={active === 'upcoming'}
      onPress={() => onChange('upcoming')}
    />
    <TabButton
      label="Отмененные"
      count={completedCount}
      active={active === 'cancelled'}
      onPress={() => onChange('cancelled')}
    />
    <TabButton
      label="Завершённые"
      count={completedCount}
      active={active === 'finished'}
      onPress={() => onChange('finished')}
    />
  </View>
);

interface TabButtonProps {
  label:   string;
  count:   number;
  active:  boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, count, active, onPress }) => (
  <TouchableOpacity
    style={[s.tabBtn, active && s.tabBtnActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[s.tabTxt, active && s.tabTxtActive]}>{label}</Text>
    {count > 0 && (
      <View style={[s.tabCount, active && s.tabCountActive]}>
        <Text style={[s.tabCountTxt, active && s.tabCountTxtActive]}>
          {count}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);