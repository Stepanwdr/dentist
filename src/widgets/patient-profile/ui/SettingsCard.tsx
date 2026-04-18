import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/theme/colors';
import {tokenStorage} from "@shared/lib/tokenStorage";
import {useAuth} from "@features/auth/model/useAuth";

interface SettingItem {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

const SETTINGS: SettingItem[] = [
  { iconName: 'notifications-outline', label: 'Уведомления', onPress: () => {} },
  { iconName: 'lock-closed-outline', label: 'Безопасность', onPress: () => {} },
  { iconName: 'help-circle-outline', label: 'Поддержка', onPress: () => {} },
  { iconName: 'document-text-outline', label: 'Политика конфиденциальности', onPress: () => {} },
];

const DANGER_SETTINGS: SettingItem[] = [
  {
    iconName: 'log-out-outline',
    label: 'Выйти из аккаунта',
    onPress: async () => {
      Alert.alert('Выход', 'Вы уверены?')
      await tokenStorage.clearTokens()
    },
    destructive: true,
  },
];

function SettingRow({ item }: { item: SettingItem }) {
  const { logout } = useAuth()


  const handleLogout = () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <TouchableOpacity style={styles.row} onPress={item.iconName === 'log-out-outline' ? handleLogout : item.onPress } activeOpacity={0.7}>
      <View
        style={[
          styles.iconWrap,
          item.destructive ? { backgroundColor: Colors.dangerLight } : { backgroundColor: Colors.primaryLight },
        ]}
      >
        <Ionicons
          name={item.iconName}
          size={18}
          color={item.destructive ? Colors.danger : Colors.primary}
        />
      </View>
      <Text style={[styles.label, item.destructive && { color: Colors.danger }]}>
        {item.label}
      </Text>
      {!item.destructive && (
        <Ionicons name="chevron-forward" size={18} color={Colors.textDisabled} />
      )}
    </TouchableOpacity>
  );
}

export const SettingsCard: React.FC = () => (
  <>
    <View style={styles.card}>
      {SETTINGS.map((item, idx) => (
        <View key={item.label}>
          <SettingRow item={item} />
          {idx < SETTINGS.length - 1 && <View style={styles.sep} />}
        </View>
      ))}
    </View>
    <View style={[styles.card, { marginTop: 12 ,marginBottom: 60}]}>
      {DANGER_SETTINGS.map(item => (
        <SettingRow key={item.label} item={item} />
      ))}
    </View>
  </>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  iconWrap: { width: 34, height: 34, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  label: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
  sep: { height: 1, backgroundColor: Colors.separator },
});
