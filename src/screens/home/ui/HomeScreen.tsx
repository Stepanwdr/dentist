import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {HeaderCard} from "@widgets/header-card/ui/HeaderCard";
import { DoctorList } from "@widgets/doctors-list/ui/DoctorList";
import {  NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabParamList } from "@app/navigation/types";
import {Drawer} from "@shared/ux/Drawer";
import {Notifications} from "@widgets/notifications/ui/Notifications";
import {useNotifications} from "@entities/notifications/model/notification.hook";
import { useMeQuery } from "@shared/api";
import NextBookingCard from "@widgets/booking/ui/NextBookingCard";
import { HomeColor, SHADOW_SM } from "@shared/theme/home";
import { TimeLineSection } from "@widgets/TimeLineSection/TimeLineSection";
import { Connector } from "@widgets/TimeLineSection/Connector";

// ─── HomeScreen ──────────────────────────────────────────────────────────────
interface IProps {
  navigation: NativeStackNavigationProp<TabParamList, 'HomeTab'>;
}

const HomeScreen: React.FC<IProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {refetch} = useNotifications({page:1});
  const { refetch: refetchUseMe } = useMeQuery();
  const headerY = useRef(new Animated.Value(-20)).current;
  const headerO = useRef(new Animated.Value(0)).current;
  const [openNotifModal,setOpenNotifModal] = useState(false);

    const onNextBookCreate = ()=> {
      navigation.navigate('BookingTab',{ screen: "Time", params:{} })
    }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerY, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(headerO, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);


  useEffect(() => {
    if(openNotifModal) void refetch()
    if(!openNotifModal) void refetchUseMe()
  }, [openNotifModal]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={HomeColor.bg} />
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top, opacity: headerO  },
        ]}
      >
      <HeaderCard
        insetTop={2}
        headerY={headerY}
        headerO={headerO}
        onBellPress={()=>
          setOpenNotifModal(prevState => !prevState)}
      />
      </Animated.View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <TimeLineSection/>
        {/* ── Connector ── */}
        <View style={styles.connectorSection}>
          <Connector />
        </View>
        {/* ── Appointment Details Section ── */}
        <Text style={styles.sectionTitle}>Appointments details</Text>
        <NextBookingCard onNextBookCreate={onNextBookCreate}  />
        {/* ── Dentists Section ── */}
        <Text style={styles.sectionTitle}>Dentists</Text>
        <DoctorList navigation={navigation} horizontal />
      </ScrollView>
        <Drawer visible={openNotifModal} onClose={() => setOpenNotifModal(false)}>
          <Notifications/>
        </Drawer>
    </View>
  );
};


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: HomeColor.bg,
  },
  connectorSection: {
    alignItems: 'center',
    marginVertical: -10,
    height: 20,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    backgroundColor: HomeColor.bg,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: HomeColor.text,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 13,
    color: HomeColor.textSub,
    marginTop: 2,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: HomeColor.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW_SM,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: HomeColor.white,
  },
  avatarOnline: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: HomeColor.green,
    borderWidth: 2,
    borderColor: HomeColor.bg,
  },

  scroll: { flex: 1 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: HomeColor.primary,
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: -0.3,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});

export default HomeScreen;
