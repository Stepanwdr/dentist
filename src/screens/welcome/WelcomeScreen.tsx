import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image
} from 'react-native';

import {SafeAreaView} from "react-native-safe-area-context";
import {FloatingTooth} from "@shared/ui/FloatingTooth";
import {Colors} from "@shared/theme/colors";
import {shadow} from "@features/book-slot/lib";
import {bookingColors as C} from "@shared/theme/Booking.colors";
import {LinearGradient} from "expo-linear-gradient";

export default function WelcomeScreen({ navigation }:{ navigation:any }) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0080FF', '#FFFFFF','#489EF3']} // 👈 можешь менять
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.root}
      >
        <StatusBar barStyle="light-content" backgroundColor="#5aabda" />
        <Image
          source={require('@shared/assets/welcomeBg.png')}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={styles.safe}>
          <FloatingTooth size={'l'}/>

          <View style={styles.body}>
            <Text style={styles.welcomeText}>
              Ваша идеальная улыбка  начинается с
            </Text>
            <Text style={styles.logoText}>DENTRICA</Text>
          </View>
          <View style={styles.bottomBar}>
            {/* Назад */}
            <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85} onPress={ ()=> navigation.navigate('Auth')}>
              <Text style={styles.bookText}>Начать {">"}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

    </View>
  );
}

// ── Стили ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F6FA',
  },

  safe: {
    flex: 1,
    justifyContent: 'space-between',
    maxHeight: Dimensions.get('window').height * 0.9,
  },
  body: {
    flex: 1,
    textAlign:'center',
    alignItems: 'center',
  },
  welcomeText: {
    textAlign:'center',
    fontSize: 36,
    fontWeight:'bold',
    paddingLeft: 22,
    color: Colors.primary,
  },
  logoText: {
    textAlign:'center',
    color:Colors.primary,
    fontSize: 60,
    marginTop:14
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  // Текст героя
  heroText: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 14,
    color: '#d0eaf8',
    lineHeight: 21,
  },

  // Зубы
  teethContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  // Нижний бар
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 24,
    gap: 10,
  },
  circleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtn: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 50,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    maxWidth:294,
    ...shadow(C.skyTop, 0.38, 16, 7),
  },
  bookText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
