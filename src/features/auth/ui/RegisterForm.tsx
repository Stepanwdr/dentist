// src/features/auth/ui/RegisterForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@shared/theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterFormProps {
  loading: boolean;
  serverError: string | null;
  onSubmit: (values: RegisterFormValues) => void;
}

// ─── Phone formatter ──────────────────────────────────────────────────────────

function formatPhone(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0)  return '';
  if (digits.length <= 3)   return `+${digits}`;
  if (digits.length <= 5)   return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 8)   return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
  if (digits.length <= 10)  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  // → +374 91 123 45 67
}


// ─── Password strength ────────────────────────────────────────────────────────

interface StrengthResult {
  score: 0 | 1 | 2 | 3;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): StrengthResult {
  if (password.length === 0) return { score: 0, label: '', color: Colors.border };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9!@#$%^&*]/.test(password)) score++;

  const map: Record<number, StrengthResult> = {
    0: { score: 0, label: '', color: Colors.border },
    1: { score: 1, label: 'Слабый', color: Colors.danger },
    2: { score: 2, label: 'Средний', color: Colors.warning },
    3: { score: 3, label: 'Сильный', color: Colors.success },
  };
  return map[score] as StrengthResult;
}

// ─── Shared input field ───────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words';
  secure?: boolean;
  rightSlot?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label, value, onChangeText, placeholder,
  iconName, error, keyboardType = 'default',
  autoCapitalize = 'none', secure = false, rightSlot,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <View style={[
        f.row,
        focused && f.rowFocused,
        !!error && f.rowError,
      ]}>
        <Ionicons
          name={iconName}
          size={18}
          color={focused ? Colors.primary : Colors.textMuted}
        />
        <TextInput
          style={f.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightSlot}
      </View>
      {!!error && (
        <View style={f.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={Colors.danger} />
          <Text style={f.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const RegisterForm: React.FC<RegisterFormProps> = ({
  loading,
  serverError,
  onSubmit,
}) => {
  const [values, setValues] = useState<RegisterFormValues>({
    name: '', email: '', phone: '', password: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(values.password);

  function setField(key: keyof RegisterFormValues) {
    return (value: string) => {
      setValues(prev => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };
  }

  function handlePhoneChange(text: string) {
    const formatted = formatPhone(text);
    setValues(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
  }

  function validate(): boolean {
    const e: RegisterFormErrors = {};

    if (!values.name.trim()) {
      e.name = 'Введите имя';
    } else if (values.name.trim().length < 2) {
      e.name = 'Минимум 2 символа';
    }

    if (!values.email.trim()) {
      e.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      e.email = 'Неверный формат email';
    }

    const phoneDigits = values.phone.replace(/\D/g, '');
    if (!values.phone) {
      e.phone = 'Введите номер телефона';
    } else if (phoneDigits.length < 11) {
      e.phone = 'Неверный формат номера';
    }

    if (!values.password) {
      e.password = 'Введите пароль';
    } else if (values.password.length < 6) {
      e.password = 'Минимум 6 символов';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) onSubmit(values);
  }

  return (
    <View>

      {/* Name */}
      <Field
        label="Имя"
        value={values.name}
        onChangeText={setField('name')}
        placeholder="Иван Иванов"
        iconName="person-outline"
        autoCapitalize="words"
        error={errors.name}
      />

      {/* Email */}
      <Field
        label="Email"
        value={values.email}
        onChangeText={setField('email')}
        placeholder="your@email.com"
        iconName="mail-outline"
        keyboardType="email-address"
        error={errors.email}
      />

      {/* Phone */}
      <Field
        label="Телефон"
        value={values.phone}
        onChangeText={handlePhoneChange}
        placeholder="+374 55 13 13 13"
        iconName="call-outline"
        keyboardType="phone-pad"
        error={errors.phone}
      />

      {/* Password */}
      <View style={s.passwordWrap}>
        <Field
          label="Пароль"
          value={values.password}
          onChangeText={setField('password')}
          placeholder="Минимум 6 символов"
          iconName="lock-closed-outline"
          secure={!showPassword}
          error={errors.password}
          rightSlot={
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          }
        />

        {/* Strength bar */}
        {values.password.length > 0 && (
          <View style={s.strengthWrap}>
            <View style={s.strengthBars}>
              {[1, 2, 3].map(i => (
                <View
                  key={i}
                  style={[
                    s.strengthBar,
                    { backgroundColor: i <= strength.score ? strength.color : Colors.separator },
                  ]}
                />
              ))}
            </View>
            {strength.label ? (
              <Text style={[s.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      {/* Server error */}
      {!!serverError && (
        <View style={s.serverError}>
          <Ionicons name="alert-circle-outline" size={15} color={Colors.danger} />
          <Text style={s.serverErrorText}>{serverError}</Text>
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[s.submitBtn, loading && s.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={Colors.surface} size="small" />
        ) : (
          <Text style={s.submitBtnText}>Создать аккаунт</Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

// ─── Field styles ─────────────────────────────────────────────────────────────

const f = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 50,
  },
  rowFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  rowError: {
    borderColor: Colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginLeft: 2,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
  },
});

// ─── Component styles ─────────────────────────────────────────────────────────

const s = StyleSheet.create({
  passwordWrap: {
    marginBottom: 14,
  },
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    marginLeft: 2,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 52,
    textAlign: 'right',
  },
  serverError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.dangerLight,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  serverErrorText: {
    fontSize: 13,
    color: Colors.danger,
    flex: 1,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.primaryDim,
  },
  submitBtnText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
