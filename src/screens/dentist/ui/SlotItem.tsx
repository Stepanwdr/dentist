import React, {FC} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {HomeColor} from "@shared/theme/home";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {Patient} from "@shared/types/patient";
import { AppointmentsTab } from "@shared/types/booking";


export type ActionType = "ASSIGN" | "CLOSE" | 'OPEN' | 'CONFIRM' | 'CANCEL'


interface Props {
  time: string
  patient:Patient
  service:string
  status:AppointmentsTab
  onAction:(action:ActionType,id:string)=>void
  id:string
}
export const SlotItem:FC<Props> = ({ time, patient, service, status, onAction,id }) => {
  const isAvailable = status === 'free';
  const isBlocked = status === 'blocked';
  const isPending = status === 'pending';
  const isActive = status === 'booked';

  return (
    <View style={[styles.slotContainer, isBlocked && styles.slotBlocked]}>
      <View style={styles.timeContainer}>
        <Text style={{textAlign:"center"}}> {time} </Text>
      </View>
      <View style={styles.contentSection}>
        {isAvailable ? (
          <View style={styles.availableRow}>
            <Text style={styles.availableText}>Пациент не назначено</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.btnAssign} onPress={() => onAction('ASSIGN',id)}>
                <Ionicons name="person-add-outline" size={16} color={HomeColor.primary} />
                <Text style={styles.btnTextPrimary}>Назначить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnClose} onPress={() => onAction('CLOSE',id)}>
                <Ionicons name="lock-closed-outline" size={16} color={HomeColor.pink} />
                <Text style={styles.btnTextSecondary}>Закрыть слот</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : isBlocked ? (
          <View style={styles.blockedRow}>
            <View>
              <Text style={styles.blockedTitle}>Слот закрыт</Text>
              <Text style={styles.blockedSub}>Занят / перерыв</Text>
            </View>
            <TouchableOpacity style={styles.btnOpen} onPress={() => onAction('OPEN',id)}>
              <MaterialCommunityIcons name="lock-open-outline" size={16} color={HomeColor.textSub} />
              <Text style={styles.btnOpenText}>Открыть</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.patientRow}>
            <View>
              <Text style={styles.patientName}>{patient.name}</Text>
              <View style={styles.typeRow}>
                <View style={[styles.typeDot, { backgroundColor: HomeColor.teal }]} />
                <Text style={styles.typeText}>{service}</Text>
              </View>
            </View>
            {isPending && <View style={styles.actions}>
              <TouchableOpacity style={styles.btnApprove} onPress={() => onAction('CONFIRM',id)}>
                <Ionicons name="checkmark-outline" size={16} color={HomeColor.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnIgnore} onPress={() => onAction('CANCEL',id)}>
                <Ionicons name="close-outline" size={16} color={HomeColor.white} />
              </TouchableOpacity>
            </View>}
          </View>
        )}
      </View>
    </View>

  );
};


const styles = StyleSheet.create({
  slotContainer: { backgroundColor: HomeColor.white, borderRadius: 24, padding: 16, flexDirection: 'row', marginBottom: 12, minHeight: 90,alignItems:"center",overflow:'hidden',paddingLeft:80 },
  timeContainer: {
    borderRadius: 24,
    backgroundColor: HomeColor.bg,
    height: 100,
    textAlign: "center",
    position: 'absolute',
    width: '25%',
    justifyContent:"center",
  },
  slotBlocked: { backgroundColor: 'rgba(255,255,255,0.5)', borderStyle: 'dashed', borderWidth: 1, borderColor: HomeColor.border },
  timeSection: { width: 60, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: HomeColor.bg },
  timeText: { fontSize: 18, fontWeight: '800', color: HomeColor.primaryDark },
  timeAmPm: { fontSize: 10, color: HomeColor.textMuted, fontWeight: 'bold' },
  blockedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availableRow: { flexDirection: 'column' },
  availableText: { fontSize: 14, color: HomeColor.textMuted, marginBottom: 8, fontStyle: 'italic' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  btnAssign: { backgroundColor: HomeColor.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,flexDirection:"row",alignItems: "center", justifyContent: "center",gap:5 },
  btnClose: { backgroundColor: HomeColor.pinkLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,flexDirection:"row",gap:5,alignItems:"center", justifyContent: "center" },
  btnTextPrimary: { color: HomeColor.primaryDark, fontWeight: 'bold', fontSize: 12 },
  btnTextSecondary: { color: HomeColor.pink, fontWeight: 'bold', fontSize: 12 },
  btnApprove:{backgroundColor:HomeColor.pink,color:HomeColor.white,borderRadius:30,paddingHorizontal:10,paddingVertical:10,maxWidth:100,textAlign:"center"},
  btnIgnore:{backgroundColor:HomeColor.primary,color:HomeColor.white,borderRadius:30,paddingHorizontal:10,paddingVertical:10,maxWidth:100,textAlign:"center"},
  contentSection: { flex: 1, paddingLeft: 16, justifyContent: 'center' },
  patientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 16, fontWeight: '700', color: HomeColor.text },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  typeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  typeText: { fontSize: 12, color: HomeColor.textSub },
  blockedTitle: { fontSize: 14, color: HomeColor.textMuted, fontWeight: '600' },
  blockedSub: { fontSize: 11, color: HomeColor.textMuted,width:150, },
  btnOpen: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: HomeColor.border, borderRadius: 12 },
  btnOpenText: { fontSize: 12, color: HomeColor.textSub, marginLeft: 4, fontWeight: 'bold' },
  actions:{
    flexDirection: 'row',
    maxWidth:100,
    alignItems:'center',
    gap:5
  },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 64, height: 64, borderRadius: 32, backgroundColor: HomeColor.pink, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: HomeColor.pink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 }
})