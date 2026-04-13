// src/widgets/doctors-list/ui/ServiceFilterTag.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '@shared/types';
import { Colors } from '@shared/theme/colors';
import {SafeAreaView} from "react-native-safe-area-context";

interface ServiceFilterTagProps {
  service: Service;
}

export const ServiceFilterTag: React.FC<ServiceFilterTagProps> = ({ service }) => (
  <SafeAreaView style={styles.tag}>
    <Ionicons name="medical" size={14} color={Colors.primary} />
    <Text style={styles.text}>{service.title}</Text>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 12,
  },
  text: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
