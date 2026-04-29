import {Text, TouchableOpacity, View, StyleSheet, Platform, Image} from "react-native";
import {Colors} from "@shared/theme/colors";
import React from "react";
import {useMeQuery} from "@shared/api";
import {Ionicons} from "@expo/vector-icons";
const C = {
  // Sky blue gradient
  skyTop:    '#4A9FF5',
  skyBot:    '#2D7DD2',
  skyLayer2: '#5BAEF7',   // mid layer
  skyLayer3: '#6BBCF9',   // deep layer
  // Accents
  teal:      '#4DD9AC',
  tealGlow:  'rgba(77,217,172,0.40)',
  pink:      '#FF4D7D',
  pinkGlow:  'rgba(255,77,125,0.40)',
  green:     '#22C55E',
  // Text on card
  cardText:  '#FFFFFF',
  cardSub:   'rgba(255,255,255,0.65)',
  cardMuted: 'rgba(255,255,255,0.42)',
  cardFill:  'rgba(255,255,255,0.13)',
  cardBorder:'rgba(255,255,255,0.18)',
  cardIcon:  'rgba(255,255,255,0.20)',
};
const mkShadow = (color = '#000', op = 0.14, r = 16, y = 6) =>
  Platform.select({
    ios:     { shadowColor: color, shadowOffset: { width: 0, height: y }, shadowOpacity: op, shadowRadius: r },
    android: { elevation: Math.max(2, Math.round(r * 0.55)) },
  }) ?? {};


export const Header = ({onToggle,isOpen}:{onToggle:()=>void,isOpen:boolean}) => {
  const { data } = useMeQuery()
  const unreadCount = data?.unreadNotifications

  return (
    <View  style={styles.header}>
      <View style={styles.left}>
        { data?.avatar
          ? <View style={styles.imageContainer}>
            <Image source={{uri: data?.avatar}} style={styles.image}/>
          </View>
          : <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
            {data?.name?.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        }
        <Text style={styles.doctorName}>
          Др. {data?.name}
        </Text>
      </View>

      <TouchableOpacity onPress={onToggle}>
        <Ionicons name={!isOpen ? 'notifications-outline' : 'notifications'} size={28}  color={Colors.dangerLight} />
        {unreadCount && unreadCount > 0 && (
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

    </View>
  );
};

const styles= StyleSheet.create({
  header: {
    justifyContent:"space-between",
    backgroundColor: Colors.primary,
    padding:20,
    flexDirection:"row",
    alignItems:"center",
    borderBottomEndRadius:32,
    borderBottomLeftRadius:32,
    paddingTop:60,
    ...mkShadow(C.cardSub, 0.20, 6, 10),
  },

  left:{
    flex:1,
    flexDirection:"row",
    gap:8,
    alignItems:'center',
    width:"auto"
  },
  doctorName:{
    color:'white',
    fontSize: 20,
    flex:1,
    fontWeight:"bold"
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    overflow: "hidden",
    marginRight: 8,
    borderWidth:2,
    borderColor:"white"
  },
  image: {
    width: 52,
    height: 60,
    top: 0,
    left: -5,
    borderRadius: 999,
  },
  notifBadge: {
    position: 'absolute', top: -10, right: -10,
    minWidth: 25, height: 25, borderRadius: 999,
    backgroundColor: C.pink,
    borderWidth: 1.5, borderColor: C.skyTop,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 2,
    ...mkShadow(C.pink, 0.50, 6, 2),
  },
  notifBadgeText: {
    fontSize: 12, fontWeight: '900', color: '#fff', lineHeight: 11,
  },
  avatarWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.32)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12, fontWeight: '800', color: C.cardText,
  },

})