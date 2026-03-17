// src/features/auth/ui/OtpStep.tsx
import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Colors } from '@shared/config/colors';

const OTP_LENGTH = 6;

interface OtpStepProps {
  phone: string;
  loading: boolean;
  error: string | null;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

export const OtpStep: React.FC<OtpStepProps> = ({
  phone, loading, error, onSubmit, onResend, onBack,
}) => {
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  function handleChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    if (digits.length === OTP_LENGTH) {
      onSubmit(digits);
    }
  }

  const digits = code.split('');

  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.back} onPress={onBack}>
        <Text style={styles.backText}>← Изменить номер</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>
        Код отправлен на{'\n'}
        <Text style={styles.phone}>{phone}</Text>
      </Text>

      {/* Визуальные ячейки */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={styles.cells}
      >
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              digits[i] !== undefined && styles.cellFilled,
              i === digits.length && styles.cellActive,
              error && styles.cellError,
            ]}
          >
            <Text style={styles.cellText}>{digits[i] ?? ''}</Text>
          </View>
        ))}
      </TouchableOpacity>

      {/* Скрытый реальный input */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        autoFocus
        style={styles.hidden}
        caretHidden
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={Colors.primary} size="small" />
          <Text style={styles.loadingText}>Проверяем код...</Text>
        </View>
      )}

      <TouchableOpacity onPress={onResend} style={styles.resend}>
        <Text style={styles.resendText}>Отправить код повторно</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center' },
  back: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  phone: { fontWeight: '700', color: Colors.text },
  cells: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  cell: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  cellActive: { borderColor: Colors.primary, borderWidth: 2 },
  cellError: { borderColor: Colors.danger },
  cellText: { fontSize: 22, fontWeight: '700', color: Colors.text },
  hidden: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  error: {
    fontSize: 13,
    color: Colors.danger,
    marginTop: 8,
    marginBottom: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  loadingText: { fontSize: 13, color: Colors.textSecondary },
  resend: { marginTop: 20 },
  resendText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
