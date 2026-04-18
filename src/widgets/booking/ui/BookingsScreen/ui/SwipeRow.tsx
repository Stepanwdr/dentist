import React, { useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity,
  Animated, PanResponder,
} from 'react-native';
import { TimeSlot } from '@shared/types/slot';
import { s } from '../BookingScreen.styles';
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/theme/colors";
import {BookStatus} from "@shared/ui/BookStatus";

const ACTION_W   = 70;
const ACTIONS_W  = ACTION_W * 3;
const THRESHOLD  = 60;

const dateColor = (date: string) => {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
  if (days <= 10) return '#4A9FF5';
  if (days <= 30) return '#FF4D7D';
  return '#4DD9AC';
};

const daysLeft = (date: string) =>
  Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);

interface SwipeRowProps {
  item:         TimeSlot;
  onReschedule: (item: TimeSlot) => void;
  onEdit:       (item: TimeSlot) => void;
  onCancel:     (item: TimeSlot) => void;
}

export const SwipeRow: React.FC<SwipeRowProps> = ({
                                                    item, onReschedule, onEdit, onCancel,
                                                  }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const isOpen     = useRef(false);

  const close = useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0, useNativeDriver: true, tension: 180, friction: 12,
    }).start();
    isOpen.current = false;
  }, []);

  const open = useCallback(() => {
    Animated.spring(translateX, {
      toValue: -ACTIONS_W, useNativeDriver: true, tension: 180, friction: 12,
    }).start();
    isOpen.current = true;
  }, []);

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder:  (_, g) =>
      Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderGrant: () => translateX.stopAnimation(),
    onPanResponderMove:  (_, g) => {
      const base = isOpen.current ? -ACTIONS_W : 0;
      translateX.setValue(Math.max(-ACTIONS_W, Math.min(0, base + g.dx)));
    },
    onPanResponderRelease: (_, g) => {
      const base = isOpen.current ? -ACTIONS_W : 0;
      (base + g.dx < -THRESHOLD) ? open() : close();
    },
  })).current;

  const color = dateColor(item.date);
  const days  = daysLeft(item.date);
  const day   = new Date(item.date).getDate();
  const mon   = new Date(item.date)
    .toLocaleString('ru', { month: 'short' }).toUpperCase();

  return (
    <View style={s.swipeWrap}>
      {/* Actions */}
      <View style={s.actions}>
        <TouchableOpacity
          style={[s.action, { backgroundColor: '#4DD9AC' }]}
          onPress={() => { close(); onReschedule(item); }}
        >
          <Text style={s.actionIcon}>
            <Ionicons name="calendar" color="white" size={20} />
          </Text>
          <Text style={s.actionLbl}>Перенос</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.action, { backgroundColor: Colors.primary }]}
          onPress={() => { close(); onEdit(item); }}
        >
          <Text style={s.actionIcon}>
            <Ionicons name="pencil" color="white" size={20} />
          </Text>
          <Text style={s.actionLbl}>Изменить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.action, { backgroundColor: '#FF4D7D' }]}
          onPress={() => { close(); onCancel(item); }}
        >
          <Text style={s.actionIcon}>✕</Text>
          <Text style={s.actionLbl}>Отмена</Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <Animated.View
        style={[s.card, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[s.cardAccent, { backgroundColor: color }]} />
        <View style={s.cardBody}>
          <View style={s.cardRow}>
            {/* Date badge */}
            <View style={[s.dateBadge, { backgroundColor: color }]}>
              <Text style={s.dateNum}>{day}</Text>
              <Text style={s.dateMon}>{mon}</Text>
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <View style={[s.cardRow, { marginBottom: 2 }]}>
                <Text style={s.doctorName}>{item.dentist?.name ?? '—'}</Text>
                <View style={{ flex: 1}}>
                  <View style={[s.pill, { backgroundColor: color + '22' }]}>
                    <Text style={[s.pillTxt, { color }]}>До визита {days} дня</Text>
                  </View>
                  <View style={{ position:'absolute',top:30, right:0 }}>
                    <BookStatus status={item.status} />
                  </View>
                </View>
              </View>
              <Text style={{color:'#30292a'}}>{item.dentist?.speciality ?? '—'}</Text>
              <Text style={s.serviceTxt}>
                {item.startTime} – {item.endTime}
              </Text>
              {item.notes && (
                <Text style={s.roomTxt}>{item.service}</Text>
              )}
            </View>

            {/* Swipe hint */}
            <Text style={s.chevron}>‹</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};