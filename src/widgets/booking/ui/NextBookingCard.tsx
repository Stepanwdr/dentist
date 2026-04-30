import React, {useEffect, useMemo, useRef} from "react";
import {Animated, View, StyleSheet, Text, Platform, Image} from "react-native";

import { CARD_RADIUS, HomeColor, SHADOW } from "@shared/theme/home";
import {useGetNextBooking} from "@entities/booking/model/booking.model";

import {useFocusEffect} from "@react-navigation/native";
import {BookStatus} from "@shared/ui/BookStatus";
import {Button} from "@shared/ui";

interface Props {
  onNextBookCreate: () => void
}

const NextBookingCard: React.FC<Props> = ({onNextBookCreate}) => {
  const { data, refetch } = useGetNextBooking()
  const slideUp = useRef(new Animated.Value(30)).current;
  const opacity  = useRef(new Animated.Value(0)).current;
  const { startTime, shortMonth, day, isToday } = useMemo(() => {
    if (!data?.startTime) return {};

    const date = new Date(data.date);
    const today = new Date();
    return {
      startTime: data.startTime,
      shortMonth: date.toLocaleString('en', { month: 'short' }), // May
      day: date.getDate(), // 24
      isToday: date.getDate() === today.getDate()
    };
  }, [data]);

  useFocusEffect(() => {
    void refetch()
    Animated.parallel([
      Animated.timing(slideUp, { toValue: 0,   duration: 500, delay: 400, useNativeDriver: true }),
      Animated.timing(opacity,  { toValue: 1,   duration: 500, delay: 400, useNativeDriver: true }),
    ]).start();
  });

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: slideUp }] }}>
      {/* Layer 3 — back shadow */}
      <View style={styles.cardLayer3} />
      {/* Layer 2 — mid shadow */}
      <View style={styles.cardLayer2} />
      {/* Layer 1 — main card */}
      <View style={styles.cardLayer1}>
        {/* Left: icon + info */}
        {data === null ? <Button
          label={'+ Создать следующий запись'}
          onPress={onNextBookCreate}
          style={{width:"100%"}}
          variant={'success'}
        /> :
          <>
          <View style={styles.cardIconWrap}>
        <Image source={{uri: data?.dentist?.avatar}} style={styles.image}/>
         </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardSpecialty}>{data?.dentist?.speciality}</Text>
        <Text style={styles.cardDoctor}>{data?.dentist?.name}</Text>
        <Text style={styles.cardProcedure}>{data?.service}</Text>
        {/*<Text style={styles.cardRating}>★ {data?.dentist?.rating}</Text>*/}
        <Text style={styles.phone}>{data?.dentist?.phone}</Text>
      </View>
      {/* Right: teal date + pink NEXT */}
      <View style={styles.cardRight}>
        <View style={styles.cardDateBlock}>
          {isToday ? <Text style={styles.cardDateDay}>Сегодня</Text> :
            <><Text style={styles.cardDateDay}>{day}</Text>
              <Text style={styles.cardDateMonth}>{shortMonth}</Text>
            </>
          }
          <Text style={styles.cardDateTime}>{startTime}</Text>
        </View>
        <BookStatus status={data?.status || 'pending'}/>
      </View>
    </>
}
      </View>
    </Animated.View>
  );
};
export default NextBookingCard;


const styles= StyleSheet.create({
  cardLayer3: {
    position: 'absolute',
    top: 14,
    left: 12,
    right: 12,
    height: 80,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#D6E8FA',
    opacity: 0.7,
  },
  image:{
    width: '100%',
    height: 48,
    borderRadius: 14,
    marginBottom: 8,
  },
  cardLayer2: {
    position: 'absolute',
    top: 8,
    left: 6,
    right: 6,
    height: 82,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#C0D8F2',
    opacity: 0.8,
  },
  cardLayer1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HomeColor.white,
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 6,
    ...SHADOW,
  },
  cardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: HomeColor.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardSpecialty: {
    fontSize: 12,
    color: HomeColor.textMuted,
    fontWeight: '500',
  },
  cardDoctor: {
    fontSize: 15,
    fontWeight: '800',
    color: HomeColor.text,
    letterSpacing: -0.3,
  },
  cardProcedure: {
    fontSize: 14,
    fontWeight: '600',
    color: HomeColor.primary,
    marginBottom: 5
  },
  phone: {
    fontSize: 12,
    fontWeight: '600',
    color: HomeColor.textSub,
    textAlign: 'left',
    left:-5
  },
  cardRating: {
    fontSize: 11,
    color: HomeColor.textMuted,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  cardDateBlock: {
    width: 70,
    height: 52,
    borderRadius: 14,
    backgroundColor: HomeColor.teal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: HomeColor.teal,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 7 },
    }),
  },
  cardDateDay: {
    fontSize: 18,
    fontWeight: '900',
    color: HomeColor.white,
    lineHeight: 20,
  },
  cardDateMonth: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  cardDateTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  cardNextBadge: {
    width: 54,
    height: 22,
    borderRadius: 11,
    backgroundColor: HomeColor.pink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: HomeColor.pink,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: { elevation: 5 },
    }),
  },
  cardNextText: {
    fontSize: 10,
    fontWeight: '800',
    color: HomeColor.white,
    letterSpacing: 0.5,
  },
})