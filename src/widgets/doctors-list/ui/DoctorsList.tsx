// src/widgets/doctors-list/ui/DoctorsList.tsx
import React from 'react';
import { FlatList, View } from 'react-native';
import { Doctor, Service } from '@shared/types';
import { EmptyState } from '@shared/ui';
import { DoctorCard } from '@entities/doctor';
import { ServiceFilterTag } from './ServiceFilterTag';

interface DoctorsListProps {
  doctors: Doctor[];
  service: Service;
  onSelect: (doctor: Doctor) => void;
}

export const DoctorsList: React.FC<DoctorsListProps> = ({ doctors, service, onSelect }) => (
  <FlatList
    data={doctors}
    keyExtractor={item => item.id}
    renderItem={({ item }) => <DoctorCard doctor={item} onPress={onSelect} />}
    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
    showsVerticalScrollIndicator={false}
    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    ListHeaderComponent={<ServiceFilterTag service={service} />}
    ListEmptyComponent={
      <EmptyState
        icon="person-outline"
        title="Врачи не найдены"
        subtitle="По данной услуге специалисты временно недоступны"
      />
    }
  />
);
