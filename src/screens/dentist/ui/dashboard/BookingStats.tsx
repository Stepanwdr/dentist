import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@shared/theme/colors';
import {SHADOW} from "@shared/theme/home";
import {bookingColors} from "@shared/theme/Booking.colors";
import {STATUS_STYLES} from "@shared/ui/BookStatus";

type Props = {
  totalWait:number
  totalCompleted:number;
  totalConfirmed:number;
};

export const BookingStats: React.FC<Props> = ({ totalWait, totalCompleted,totalConfirmed }) => {
  return (
    <View style={styles.cardRoot}>
      <Text style={styles.title}>Записи сегодня</Text>
      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: bookingColors.pink }]}>
          <Text style={styles.value}>{totalWait}</Text>
          <Text style={styles.label}>ОЖИДАЕТ</Text>
        </View>
        <View style={[styles.card, { backgroundColor: STATUS_STYLES.confirmed.bg }]}>
          <Text style={[styles.value,{color:STATUS_STYLES.confirmed.color}]}>{totalConfirmed}</Text>
          <Text style={[styles.label,{color:STATUS_STYLES.confirmed.color}]}>ПОДТВЕРЖДЕНО</Text>
        </View>
        <View style={[styles.card, { backgroundColor: STATUS_STYLES.finished.bg }]}>
          <Text style={[styles.value,styles.finishedValue,{color:STATUS_STYLES.finished.color}]}>{totalCompleted}</Text>
          <Text style={[styles.label,styles.finishedLable,{color:STATUS_STYLES.finished.color}]}>ЗАВЕРШЕН</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardRoot: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    minHeight:150,
    ...SHADOW
  },
  title:{
    color: bookingColors.sky,
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical:12
  },
  finishedValue:{
    color: bookingColors.skyBot,
  },
  finishedLable:{
    color: bookingColors.sky,
  },
  cards:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingBottom:12,
   flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#fff',
    marginTop: 6,
    width: 100,
    textAlign: 'center',
  },
});
