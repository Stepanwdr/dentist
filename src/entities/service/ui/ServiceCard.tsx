// src/entities/service/ui/ServiceCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '@shared/types';
import { Colors } from '@shared/theme/colors';

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.75}
    onPress={() => onPress(service)}
  >
    <View style={[styles.iconWrap, { backgroundColor: service.color + '18' }]}>
      <Ionicons
        name={service.iconName as React.ComponentProps<typeof Ionicons>['name']}
        size={28}
        color={service.color}
      />
    </View>

    <View style={styles.content}>
      <Text style={styles.title}>{service.title}</Text>
      <Text style={styles.desc} numberOfLines={2}>{service.description}</Text>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>{service.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="card-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>{service.price}</Text>
        </View>
      </View>
    </View>

    <Ionicons name="chevron-forward" size={20} color={Colors.textDisabled} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  desc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  meta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: Colors.textMuted },
});
