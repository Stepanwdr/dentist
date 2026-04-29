import {View, StyleSheet, TouchableOpacity, Text, Image} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {HomeColor, SHADOW} from "@shared/theme/home";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {BookStatus} from "@shared/ui/BookStatus";
import {timeLeft} from "@shared/utils/date";
import {useGetNextBooking} from "@entities/booking/model/booking.model";
import {Avatar} from "@shared/ui";
import React from "react";
import {bookingColors as C} from "@shared/theme/Booking.colors";

export const NextBookCard = () => {
  const {data} = useGetNextBooking()

  return (
    <LinearGradient
      colors={[HomeColor.primary, HomeColor.primaryDark]}
      style={styles.nextPatientCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.nextPatientHeader}>
        <BookStatus status={data?.status || 'pending'}/>
         <View style={styles.timeLeft}>
           <Text style={styles.timeLeftText}>Սկիզբը {timeLeft(data?.date || '',data?.startTime || '')}</Text>
         </View>
      </View>

      <View style={styles.patientInfoRow}>
        {data?.patient?.avatar ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: data?.patient?.avatar }} style={styles.image} resizeMode="cover" />
          </View>
        ) : (
          <View style={[styles.doctorAvatar ,styles.doctorAvatarSelected]}>
            <Text style={styles.doctorInitials}>{data?.patient?.name[0]}</Text>
          </View>
        )}
        <View style={styles.patientNameContainer}>
          <Text style={styles.patientName}>{data?.patient?.name}</Text>
          <Text style={styles.appointmentTime}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={HomeColor.white} /> {data?.startTime} — {data?.service}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Смотреть</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  nextPatientCard: { borderRadius: 32, padding: 24, ...SHADOW  },
  nextPatientHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: HomeColor.white, fontSize: 10, fontWeight: 'bold' },
  patientInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)' },
  patientNameContainer: { marginLeft: 16 },
  patientName: { fontSize: 22, fontWeight: 'bold', color: HomeColor.white },
  appointmentTime: { fontSize: 14, color: HomeColor.white, opacity: 0.8, marginTop: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  secondaryButton: {borderWidth:1,borderColor: HomeColor.white, backgroundColor: HomeColor.primary, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',maxWidth:180 },
  secondaryButtonText: { color: HomeColor.white, fontWeight: 'bold', marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: HomeColor.text },
  timeLeft: {
  },
  timeLeftText:{
    color: HomeColor.white,
    fontWeight:"bold",
    fontSize:18,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 999,
    overflow: "hidden",
    marginRight: 8,
  },
  image: {
    width: 70,
    height: 60,
    position: "absolute",
    top: -5,
    left: -20,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  doctorAvatarSelected: {
    backgroundColor: "#E0F2FE",
    borderColor: C.skyTop,
  },
  doctorInitials: { fontSize: 14, fontWeight: "800", color: C.skyBot },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: "800", color: C.text, letterSpacing: -0.2 },
});
