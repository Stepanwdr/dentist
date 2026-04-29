import React from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';
import { Avatar } from '@shared/ui/Avatar';
import {HomeColor} from "@shared/theme/home";

type QueueItem = { id: string; name: string; time?: string; note?: string };

type Props = { items: QueueItem[] };

export const QueueList: React.FC<Props> = ({ items }) => {
  const renderItem = ({ item, index }: { item: QueueItem ,index: number}) => (
    <View style={styles.queueItem}>
      <View style={styles.queueAvatar} />
      <View style={styles.queueInfo}>
        <Text style={styles.queueName}>{item.name}</Text>
        <Text style={styles.queueSub}>11:15 AM · Tooth Extraction</Text>
      </View>
      <View style={[styles.statusDot, { backgroundColor: index === 0 ? HomeColor.green : 'orange' }]} />
    </View>
  );
  return (
    <FlatList data={items} renderItem={renderItem} keyExtractor={(i) => i.id} contentContainerStyle={styles.list} />
  );
};

const styles = StyleSheet.create({
  queueItem: { backgroundColor: HomeColor.white, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  queueAvatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: HomeColor.primaryLight },
  queueInfo: { flex: 1, marginLeft: 12 },
  queueName: { fontSize: 16, fontWeight: '700', color: HomeColor.text },
  queueSub: { fontSize: 12, color: HomeColor.textSub, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  list:{

  },
  fab: { position: 'absolute', bottom: 30, left: Dimensions.get('window').width / 2 - 30, width: 60, height: 60, borderRadius: 30, backgroundColor: HomeColor.primaryDark, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: HomeColor.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }
});
