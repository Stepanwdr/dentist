import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { ServicesPage } from '@screens/services';
import { DoctorsPage } from '@screens/doctors';
import { BookingPage } from '@screens/booking';
import { ConfirmationPage } from '@screens/confirmation';
import { AppointmentsPage } from '@screens/appointments';
import { ProfilePage } from '@screens/profile';
import { AuthPage } from '@screens/login';

import { Colors } from '@shared/config/colors';
import { RootStackParamList, TabParamList } from './types';
import { useI18n } from '@shared/i18n/core';
import {useAuth} from "@features/auth/model/useAuth";

const Stack = createNativeStackNavigator<RootStackParamList>();
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
      <AuthStack.Screen name="Auth" component={AuthPage} />
    </AuthStack.Navigator>
  );
}

function BookingStack() {
  const { t } = useI18n();
  return (
    <Stack.Navigator screenOptions={STACK_OPTIONS}>
      <Stack.Screen name="Services"     component={ServicesPage}     options={{ headerShown: false }} />
      <Stack.Screen name="Doctors"      component={DoctorsPage}      options={{ title: t('title.doctors') }} />
      <Stack.Screen name="Booking"      component={BookingPage}      options={{ title: t('title.booking') }} />
      <Stack.Screen name="Confirmation" component={ConfirmationPage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof TabParamList, { active: TabIconName; inactive: TabIconName }> = {
  BookingTab:      { active: 'calendar', inactive: 'calendar-outline' },
  AppointmentsTab: { active: 'list',     inactive: 'list-outline' },
  ProfileTab:      { active: 'person',   inactive: 'person-outline' },
};

function MainTabs() {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          return <Ionicons name={focused ? icons.active : icons.inactive} size={22} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="BookingTab"      component={BookingStack}     options={{ title: t('tab.booking') }} />
      <Tab.Screen name="AppointmentsTab" component={AppointmentsPage} options={{ title: t('tab.appointments') }} />
      <Tab.Screen name="ProfileTab"      component={ProfilePage}      options={{ title: t('tab.profile') }} />
    </Tab.Navigator>
  );
}

// ── Auth Guard ────────────────────────────────────────────────────────────────

function RootNavigator() {
  const {token,loading  } = useAuth(); // ← используем твой контекст
  // init() ещё не завершился — показываем сплэш
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // токена нет → только AuthPage
  return token ? <MainTabs /> : <AuthNavigator />;
}

export function AppNavigator() {
  return (
    <NavigationContainer>
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