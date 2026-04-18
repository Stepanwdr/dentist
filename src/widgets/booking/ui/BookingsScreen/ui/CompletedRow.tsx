import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TimeSlot } from '@shared/types/slot';
import { s } from '../BookingScreen.styles';

interface CompletedRowProps {
  item:     TimeSlot;
}

export const CompletedRow: React.FC<CompletedRowProps> = ({ item }) => (
  <View style={[s.card, { opacity: 0.85 }]}>
    <View style={[s.cardAccent, { backgroundColor: '#949494' }]} />
    <View style={s.cardBody}>
      <View style={s.cardRow}>

        {/* Date badge */}
        <View style={[s.dateBadge, { backgroundColor: '#94A3B8' }]}>
          <Text style={s.dateNum}>
            {new Date(item.date).getDate()}
          </Text>
          <Text style={s.dateMon}>
            {new Date(item.date).toLocaleString('ru', { month: 'short' }).toUpperCase()}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={[s.cardRow, { marginBottom: 2 }]}>
            <Text style={s.doctorName}>{item.dentist?.name ?? '—'}</Text>
            <View style={[s.pill, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[s.pillTxt, { color: '#059669' }]}>{item.status === 'finished' ? "✓ Завершен" : "✓ Отменен"}</Text>
            </View>
          </View>

          <Text style={s.serviceTxt}>
            {item.startTime} – {item.endTime}
          </Text>
          {item.notes && (
            <Text style={s.roomTxt}>{item.notes}</Text>
          )}

          {/* Рейтинг или кнопка оценить */}
          {/*{item.rating ? (*/}
          {/*  <View style={{ flexDirection: 'row', marginTop: 4, gap: 2 }}>*/}
          {/*    {[1,2,3,4,5].map(i => (*/}
          {/*      <Text key={i} style={{ fontSize: 11, color: i <= (item.rating ?? 0) ? '#F59E0B' : '#E2EBF6' }}>*/}
          {/*        ★*/}
          {/*      </Text>*/}
          {/*    ))}*/}
          {/*  </View>*/}
          {/*) : (*/}
          {/*  <TouchableOpacity onPress={() => {}}>*/}
          {/*    <Text style={{ fontSize: 10, color: C.skyTop, marginTop: 4, fontWeight: '600' }}>*/}
          {/*      Оценить визит →*/}
          {/*    </Text>*/}
          {/*  </TouchableOpacity>*/}
          {/*)}*/}
        </View>
      </View>
    </View>
  </View>
);