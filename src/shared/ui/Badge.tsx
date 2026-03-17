// src/shared/ui/Badge.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  label: string;
  color: string;
  bg: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, bg, iconName, style }) => (
  <View style={[styles.badge, { backgroundColor: bg }, style]}>
    {iconName && <Ionicons name={iconName} size={13} color={color} />}
    <Text style={[styles.text, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
