import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from '@shared/ui/Avatar';
import { Badge } from '@shared/ui/Badge';
import { Colors } from '@shared/theme/colors';

type ActivityItem = {
  id: string;
  name: string;
  badges?: string[];
  lastVisit?: string;
  upcoming?: string;
};

type Props = {
  items: ActivityItem[];
};

export const RecentActivityList: React.FC<Props> = ({ items }) => {
  const renderItem = ({ item }: { item: ActivityItem }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar size={40} src={undefined} />
        <View style={styles.meta}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.badges}>
            {item.badges?.map((b, idx) => (
              <Badge key={idx} label={b} color={Colors.primary} />
            ))}
          </View>
        </View>
        <View style={styles.status}><Text>View</Text></View>
      </View>
      <Text style={styles.visit}>{item.lastVisit ?? 'Last visit: —'}</Text>
      <Text style={styles.upcoming}>{item.upcoming ?? ''}</Text>
      <TouchableOpacity style={styles.viewBtn}>
        <Text style={styles.viewBtnText}>View Records</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(i) => i.id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: { paddingHorizontal: 16, paddingVertical: 8 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { marginLeft: 8, flex: 1 },
  name: { fontWeight: '700' },
  badges: { flexDirection: 'row', marginTop: 4 },
  visit: { marginTop: 6, color: '#6B7280' },
  upcoming: { color: '#EF4444' },
  viewBtn: { marginTop: 8, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#E5F0FF' },
  viewBtnText: { color: '#2B6CB0', fontWeight: '700' },
  status: { alignItems: 'center' },
});
