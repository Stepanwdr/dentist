import React, {useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import {Colors} from '@shared/theme/colors';
import {SafeAreaView} from "react-native-safe-area-context";
import {authWithGoogle} from "@features/auth/api/authWithGoogle";
import {LoginForm} from "@features/auth/ui/LoginForm";
import {RegisterForm} from "@features/auth/ui/RegisterForm";
import {LoginBody, RegisterBody, useLoginMutation, useRegisterMutation} from "@shared/api";
import { FloatingTooth } from "@shared/ui/FloatingTooth";

// ─── Анимированный декоративный зуб ──────────────────────────────────────────
const ToothIllustration: React.FC = () => (
  <SafeAreaView style={ill.wrap}>
    <FloatingTooth size={'s'} />
  </SafeAreaView>
);

// ─── Разделитель OR ───────────────────────────────────────────────────────────
const Divider: React.FC = () => (
  <View style={div.row}>
    <View style={div.line}/>
    <Text style={div.text}>или</Text>
    <View style={div.line}/>
  </View>
);

// ─── Главный компонент ────────────────────────────────────────────────────────
export const AuthPage: React.FC = () => {

  const [ mode, setMode ] = useState<'login' | 'register'>('login');
  const { mutate: loginMutate } = useLoginMutation()
  const { mutate: registerMutate } = useRegisterMutation()
  const slideAnim = useRef(new Animated.Value(0)).current;

  function switchMode(next: 'login' | 'register') {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: next === 'register' ? -10 : 10,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
    ]).start();
    setMode(next);
  }

  const handleLogin=async (data: LoginBody)=>{
    loginMutate(data)
  }

  const handleRegister=(data: RegisterBody)=>{
    registerMutate(data)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Верхняя декоративная зона ── */}
          <View style={styles.hero}>
            <ToothIllustration/>
            <Text style={styles.heroTitle}>
              {mode === 'login' ? 'С возвращением!' : 'Создать аккаунт'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {mode === 'login'
                ? 'Войдите, чтобы управлять записями'
                : 'Зарегистрируйтесь за 30 секунд'}
            </Text>
          </View>

          {/* ── Карточка с формой ── */}
          <Animated.View
            style={[
              styles.card,
              {transform: [{translateX: slideAnim}]},
            ]}
          >
            {/* Tab switcher */}
            <View style={styles.tabs}>
              {(['login', 'register'] as const).map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, mode === tab && styles.tabActive]}
                  onPress={() => switchMode(tab)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tabText, mode === tab && styles.tabTextActive]}
                  >
                    {tab === 'login' ? 'Вход' : 'Регистрация'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {mode === 'login' && (<LoginForm loading={false} onSubmit={handleLogin} serverError={''}/>)}
             {mode === 'register' && (<RegisterForm loading={false} onSubmit={(data)=> handleRegister(data as RegisterBody)} serverError={''}/>)}

            {/* ── Phone flow ── */}
            <>
              <Divider/>
              <View>
                <TouchableOpacity
                  style={googleButton.btn}
                  onPress={() => authWithGoogle()}
                  activeOpacity={0.7}
                >
                  <Text style={{color:Colors.primary}}
                  >
                    Google
                  </Text>
                </TouchableOpacity>
              </View>
              {/*{googleError && (*/}
              {/*  <Text style={styles.googleError}>{googleError}</Text>*/}
              {/*)}*/}

              {/* Дисклеймер */}
              <Text style={styles.disclaimer}>
                Продолжая, вы соглашаетесь с{' '}
                <Text style={styles.disclaimerLink}>условиями использования</Text>
                {' '}и{' '}
                <Text style={styles.disclaimerLink}>политикой конфиденциальности</Text>
              </Text>
            </>
          </Animated.View>

          {/* ── Нижние фичи ── */}
          {/*<View style={styles.features}>*/}
          {/*  {[*/}
          {/*    {icon: 'shield-checkmark-outline', text: 'Безопасный вход'},*/}
          {/*    {icon: 'calendar-outline', text: 'Онлайн-запись 24/7'},*/}
          {/*    {icon: 'notifications-outline', text: 'Напоминания о визите'},*/}
          {/*  ].map(item => (*/}
          {/*    <View key={item.text} style={styles.feature}>*/}
          {/*      <View style={styles.featureIcon}>*/}
          {/*        <Ionicons*/}
          {/*          name={item.icon as React.ComponentProps<typeof Ionicons>['name']}*/}
          {/*          size={18}*/}
          {/*          color={Colors.primary}*/}
          {/*        />*/}
          {/*      </View>*/}
          {/*      <Text style={styles.featureText}>{item.text}</Text>*/}
          {/*    </View>*/}
          {/*  ))}*/}
          {/*</View>*/}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Card
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#1A1A2E',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
    marginBottom: 24,
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 24,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tabTextActive: {
    fontWeight: '700',
    color: Colors.primary,
  },

  // Google error
  googleError: {
    fontSize: 13,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 8,
  },

  // Disclaimer
  disclaimer: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 16,
  },
  disclaimerLink: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Features
  features: {
    width: '100%',
    gap: 10,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
});

// ─── Illustration styles ──────────────────────────────────────────────────────

const ill = StyleSheet.create({
  wrap: {
    width: 120,
    height: 120,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  emoji: {fontSize: 48},
  dot: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 99,
    opacity: 0.25,
  },
  dot1: {width: 10, height: 10, top: 8, right: 10},
  dot2: {width: 6, height: 6, bottom: 14, left: 6},
  dot3: {width: 14, height: 14, bottom: 4, right: 4, opacity: 0.1},
});

// ─── Divider styles ───────────────────────────────────────────────────────────

const div = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  text: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});


const googleButton = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    height: 54,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
});
