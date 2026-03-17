// src/shared/ui/Avatar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, color, size = 56 }) => (
  <View
    style={[
      styles.base,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color + '22',
        borderColor: color + '44',
      },
    ]}
  >
    <Text style={[styles.text, { fontSize: size * 0.28, color }]}>{initials}</Text>
  </View>
);

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  text: { fontWeight: '700' },
});
