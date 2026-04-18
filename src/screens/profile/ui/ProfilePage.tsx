import React, {useCallback, useEffect, useState} from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/theme/colors';
import { useI18n } from '@shared/i18n/core';
import { useBookingStore } from '@features/booking';
import { ProfileForm } from '@features/profile-edit';
import {
  PatientHeader,
  PatientStats,
  PatientInfoCard,
  SettingsCard,
} from '@widgets/patient-profile';
import { authQueryKeys, baseApi, useMeQuery } from "@shared/api";
import {registerForPush} from "@shared/lib/registerForPush";
import {useQueryClient} from "@tanstack/react-query";
import {useFocusEffect} from "@react-navigation/native";

export const ProfilePage: React.FC = () => {
  const { state } = useBookingStore();
  const { data, refetch } = useMeQuery()
  const [editing, setEditing] = useState(false);
  const { t } = useI18n();
  const qc = useQueryClient();
  const completedCount = state.appointments.filter(a => a.status === 'completed').length;
  const upcomingCount = state.appointments.filter(a => a.status === 'upcoming').length;
  const notifConfig= async () => {
    const token = await registerForPush();
    await baseApi.post("/users/push-token", {
      pushToken: token,
      userId:data?.id
    });
  }

  const invalidate= async () => {
    await qc.invalidateQueries({ queryKey: authQueryKeys.me() });
  }

  useEffect(() => {
    void notifConfig()
  }, []);

  useFocusEffect(
    useCallback(() => {
      void invalidate()
      void refetch();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.title')}</Text>
          {!editing ? (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
              <Text style={styles.editBtnText}>{t('profile.edit')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Text style={styles.cancelText}>{t('profile.cancel')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <PatientHeader patient={state.patient} />
        <PatientStats completedCount={completedCount} upcomingCount={upcomingCount} />

        <Text style={styles.sectionTitle}>Личные данные</Text>
        {editing ? (
          <ProfileForm
            initial={state.patient}
            onDone={() => setEditing(false)}
          />
        ) : (
          <PatientInfoCard patient={data}  />
        )}

        {!editing && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Настройки</Text>
            <SettingsCard />
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editBtnText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  cancelText: { fontSize: 15, color: Colors.textMuted },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 10 },
});
