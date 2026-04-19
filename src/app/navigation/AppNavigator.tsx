import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DoctorsPage } from '@screens/doctors';
import { BookingPage } from '@screens/booking';
import { ConfirmationPage } from '@screens/confirmation';
import { ProfilePage } from '@screens/profile';
import { AuthPage } from '@screens/login';

import { Colors } from '@shared/theme/colors';
import { TabParamList } from './types';
import { useI18n } from '@shared/i18n/core';
import {useAuth} from "@features/auth/model/useAuth";
import { navigationRef } from './navigationRef';
import HomeScreen from "@screens/home/ui/HomeScreen";
import BookingFlow from "@screens/booking/ui/BookingFlow";
import { CustomTabBar } from "@widgets/CustomTabBar/CustomTabBar";
import BookingsScreen from "../../screens/bookings/ui/BookingsScreen";
import WelcomeScreen from "@screens/welcome/WelcomeScreen";

const Stack = createNativeStackNavigator<TabParamList>();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<TabParamList>();

const STACK_OPTIONS = {
  headerStyle: { backgroundColor: Colors.surface },
  headerTintColor: Colors.text,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: Colors.background },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Auth" component={AuthPage}  />
    </AuthStack.Navigator>
  );
}

// function BookingStack() {
//   const { t } = useI18n();
//   return (
//     <Stack.Navigator screenOptions={STACK_OPTIONS}>
//       <Stack.Screen name="Services"     component={HomeScreen}       options={{ headerShown: false }} />
//       <Stack.Screen name="Doctors"      component={DoctorsPage}      options={{ title: t('title.doctors') }} />
//       <Stack.Screen name="Booking"      component={BookingPage}      options={{ title: t('title.booking') }} />
//       <Stack.Screen name="Confirmation" component={ConfirmationPage} options={{ headerShown: false }} />
//     </Stack.Navigator>
//   );
// }


type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

function MainTabs() {
  const { t } = useI18n();
  return (
    <Tab.Navigator
       tabBar={(props) => <CustomTabBar {...props} />}
       screenOptions={{
         headerShown: false,
       }}
       screenLayout={({ children }) => (
         <View style={{ flex: 1}}>
           {children}
         </View>
       )}
    >
      <Tab.Screen name="HomeTab"         component={HomeScreen}       options={{ title: t('tab.home') }} />
      <Tab.Screen name="DoctorsTab"      component={DoctorsPage}      options={{ title: t('tab.doctors') }} />
      <Tab.Screen name="BookingTab"      component={BookingFlow}      options={{ title: t('tab.booking') }} />
      <Tab.Screen name="AppointmentsTab" component={BookingsScreen}   options={{ title: t('tab.appointments') }} />
      <Tab.Screen name="ProfileTab"      component={ProfilePage}      options={{ title: t('tab.profile') }} />
    </Tab.Navigator>
  );
}

// ── Auth Guard ────────────────────────────────────────────────────────────────

function RootNavigator() {
  const {token, loading  } = useAuth(); // ← используем твой контекст
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.textMuted} />
      </View>
    );
  }

  // токена нет → только AuthPage
  return token ? <MainTabs /> : <AuthNavigator />;
}

export function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef} >
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});