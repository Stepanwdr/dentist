import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {bookingColors} from "@shared/theme/Booking.colors";

export default function AppointmentCard({ item }: any) {
  const isPending = item.status === 'pending';

  return (
    <View style={[styles.card, isPending && styles.pending]}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.type}>{item.type}</Text>

      {isPending ? (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.approve}>
            <Text style={{ color: 'white' }}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reschedule}>
            <Text style={{ color: bookingColors.pink }}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.confirmed}>
          <Text style={{ color: bookingColors.green }}>Confirmed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: bookingColors.white,
    borderRadius: 16,
    padding: 16,
  },
  pending: {
    borderWidth: 2,
    borderColor: bookingColors.pink,
  },
  name: {
    fontWeight: '600',
    color: bookingColors.text,
  },
  type: {
    color: bookingColors.sky,
    marginVertical: 6,
  },
  confirmed: {
    alignSelf: 'flex-start',
    backgroundColor: bookingColors.skyLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  approve: {
    backgroundColor: bookingColors.pink,
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  reschedule: {
    borderWidth: 1,
    borderColor: bookingColors.pink,
    padding: 8,
    borderRadius: 10,
  },
});