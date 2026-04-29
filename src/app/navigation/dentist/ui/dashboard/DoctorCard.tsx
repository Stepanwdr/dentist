import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@shared/ui/Avatar';
import { Colors } from '@shared/theme/colors';

type Props = {
  name: string;
  specialty?: string;
};

export const DoctorCard: React.FC<Props> = ({ name, specialty }) => {
  return (
    <View style={styles.card}>
      <Avatar size={60} src={undefined} />
      <Text style={styles.name}>{name}</Text>
      {specialty ? <Text style={styles.spec}>{specialty}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  name: { fontSize: 14, fontWeight: '700', marginTop: 6 },
  spec: { fontSize: 12, color: Colors.textMuted },
});
