import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Colors } from '@shared/config/colors';

interface PhoneInputStepProps {
  loading: boolean;
  error: string | null;
  onSubmit: (phone: string) => void;
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  loading, error, onSubmit,
}) => {
  const [phone, setPhone] = useState('');

  // Форматирование: +7 (999) 123-45-67
  function handleChangeText(text: string) {
    const digits = text.replace(/\D/g, '');
    let formatted = '';
    if (digits.length === 0) {
      formatted = '';
    } else if (digits.length <= 1) {
      formatted = `+${digits}`;
    } else if (digits.length <= 4) {
      formatted = `+${digits[0]} (${digits.slice(1)}`;
    } else if (digits.length <= 7) {
      formatted = `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    } else if (digits.length <= 9) {
      formatted = `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else {
      formatted = `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }
    setPhone(formatted);
  }

  const isValid = phone.replace(/\D/g, '').length >= 11;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Номер телефона</Text>

      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <Text style={styles.flag}>🇷🇺</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={handleChangeText}
          placeholder="+7 (999) 123-45-67"
          placeholderTextColor={Colors.textMuted}
          keyboardType="phone-pad"
          maxLength={18}
          autoFocus
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.hint}>
        Отправим SMS с кодом подтверждения
      </Text>

      <TouchableOpacity
        style={[styles.btn, (!isValid || loading) && styles.btnDisabled]}
        onPress={() => isValid && onSubmit(phone.replace(/[\s()-]/g, ''))}
        disabled={!isValid || loading}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={styles.btnText}>Получить код</Text>
        }
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 54,
    gap: 10,
  },
  inputRowError: { borderColor: Colors.danger },
  flag: { fontSize: 22 },
  input: {
    flex: 1,
    fontSize: 17,
    color: Colors.text,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  error: {
    fontSize: 13,
    color: Colors.danger,
    marginTop: 6,
    marginLeft: 4,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    marginBottom: 20,
    marginLeft: 4,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { backgroundColor: Colors.primaryDim },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
