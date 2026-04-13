// src/features/profile-edit/ui/ProfileForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Patient } from '@shared/types';
import { Colors } from '@shared/theme/colors';
import { Button } from '@shared/ui';
import { useBookingActions } from '@features/booking';

interface Field {
  key: keyof Patient;
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}

const FIELDS: Field[] = [
  { key: 'name', label: 'ФИО', iconName: 'person-outline' },
  { key: 'phone', label: 'Телефон', iconName: 'call-outline', keyboardType: 'phone-pad' },
  { key: 'email', label: 'Email', iconName: 'mail-outline', keyboardType: 'email-address' },
  { key: 'birthDate', label: 'Дата рождения', iconName: 'gift-outline' },
  { key: 'allergies', label: 'Аллергии', iconName: 'warning-outline' },
];

interface ProfileFormProps {
  initial: Patient;
  onDone: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initial, onDone }) => {
  const [draft, setDraft] = useState<Patient>(initial);
  const { updatePatient } = useBookingActions();

  function handleSave() {
    if (!draft.name.trim()) {
      Alert.alert('Ошибка', 'Имя не может быть пустым');
      return;
    }
    updatePatient(draft);
    onDone();
  }

  return (
    <View>
      <View style={styles.card}>
        {FIELDS.map((field, idx) => (
          <View key={field.key}>
            <View style={styles.row}>
              <Ionicons name={field.iconName} size={16} color={Colors.textMuted} style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={draft[field.key]}
                  onChangeText={v =>
                    setDraft(prev => ({ ...prev, [field.key]: v }))
                  }
                  keyboardType={field.keyboardType ?? 'default'}
                  autoCorrect={false}
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
            {idx < FIELDS.length - 1 && <View style={styles.sep} />}
          </View>
        ))}
      </View>

      <Button label="Сохранить изменения" onPress={handleSave} style={styles.saveBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  icon: { marginTop: 3 },
  label: { fontSize: 11, color: Colors.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { fontSize: 15, color: Colors.text, fontWeight: '500', padding: 0 },
  sep: { height: 1, backgroundColor: Colors.separator },
  saveBtn: { marginBottom: 24 },
});
