// src/widgets/services-list/ui/ServicesList.tsx
import React from 'react';
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '@shared/types';
import { Colors } from '@shared/config/colors';
import { ServiceCard } from '@entities/service';

interface ServicesListProps {
  services: Service[];
  onSelect: (service: Service) => void;
  onPromoBannerPress: () => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onSelect,
  onPromoBannerPress,
}) => (
  <FlatList
    data={services}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <ServiceCard service={item} onPress={onSelect} />
    )}
    contentContainerStyle={styles.list}
    showsVerticalScrollIndicator={false}
    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    ListHeaderComponent={
      <TouchableOpacity style={styles.banner} activeOpacity={0.85} onPress={onPromoBannerPress}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Профессиональная чистка</Text>
          <Text style={styles.bannerSub}>Первое посещение — скидка 20%</Text>
          <View style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Записаться</Text>
          </View>
        </View>
        <Ionicons name="sparkles" size={48} color="#ffffff44" />
      </TouchableOpacity>
    }
  />
);

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerContent: { flex: 1 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  bannerSub: { color: '#ffffffcc', fontSize: 13, marginBottom: 12 },
  bannerBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  bannerBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
});
