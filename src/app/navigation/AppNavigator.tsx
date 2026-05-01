import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DoctorsPage } from '@screens/doctors';
import { ProfilePage } from '@screens/profile';
import { AuthPage } from '@screens/login';

import { Colors } from '@shared/theme/colors';
import { TabParamList } from './types';
import { useI18n } from '@shared/i18n/core';
import {useAuth} from "@features/auth/model/useAuth";
import { navigationRef } from './navigationRef';
import HomeScreen from "@screens/home/ui/HomeScreen";
import BookingFlow from "@screens/booking/ui/BookingFlow";
import {CustomTabBar, Icons} from "@widgets/CustomTabBar/CustomTabBar";
import BookingsScreen from "../../screens/bookings/ui/BookingsScreen";
import WelcomeScreen from "@screens/welcome/WelcomeScreen";
import DentistTabs from "@screens/dentist/DentistTabs";

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<TabParamList>();

const patientIcons: Icons = {
  HomeTab:         { active: 'home',     inactive: 'home-outline',     label: 'Главная'   },
  BookingTab:      { active: 'calendar', inactive: 'calendar-outline', label: 'Записаться' },
  AppointmentsTab: { active: 'list',     inactive: 'list-outline',     label: 'Мои записи' },
  DoctorsTab:      { active: 'medkit',   inactive: 'medkit-outline',   label: 'Врачи'   },
  ProfileTab:      { active: 'person',   inactive: 'person-outline',   label: 'Профиль'   },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Auth" component={AuthPage}  />
    </AuthStack.Navigator>
  );
}

function PatientTabs() {
  const { t } = useI18n();
  return (
    <Tab.Navigator
       tabBar={(props) => <CustomTabBar icons={patientIcons} {...props} />}
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
  const {token, loading, user} = useAuth(); // ← используем твой контекст
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.textMuted} />
      </View>
    );
  }

  // Если есть токен, определяем flow по роли пользователя
  // Роль доктора/ dentist определяется через user.role или presence dentistId
  const isDentist = !!(user && user.role === 'dentist');
  const isPatient = !!(user && user.role === 'patient');
  // Если есть админская роль, можно добавить отдельный flow позже
  if (token && isDentist) {
    return <DentistTabs />;
  }

  if (token && isPatient) {
    return <PatientTabs />;
  }

  return  <AuthNavigator/>;
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
