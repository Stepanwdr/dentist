// src/features/auth/ui/LoginForm.tsx
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
import { Colors } from '@shared/config/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface LoginFormProps {
  loading: boolean;
  serverError: string | null;
  onSubmit: (values: LoginFormValues) => void;
  onForgotPassword?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LoginForm: React.FC<LoginFormProps> = ({
  loading,
  serverError,
  onSubmit,
  onForgotPassword,
}) => {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<keyof LoginFormValues | null>(null);

  function setField(key: keyof LoginFormValues) {
    return (value: string) => {
      setValues(prev => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    };
  }

  function validate(): boolean {
    const e: LoginFormErrors = {};
    if (!values.email.trim()) {
      e.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      e.email = 'Неверный формат email';
    }
    if (!values.password) {
      e.password = 'Введите пароль';
    } else if (values.password.length < 2) {
      e.password = 'Минимум 2 символа';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) onSubmit(values);
  }

  return (
    <View>

      {/* Email field */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Email</Text>
        <View style={[
          s.inputRow,
          focused === 'email' && s.inputFocused,
          !!errors.email && s.inputError,
        ]}>
          <Ionicons
            name="mail-outline"
            size={18}
            color={focused === 'email' ? Colors.primary : Colors.textMuted}
          />
          <TextInput
            style={s.input}
            value={values.email}
            onChangeText={setField('email')}
            placeholder="your@email.com"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
          />
        </View>
        {!!errors.email && (
          <View style={s.errorRow}>
            <Ionicons name="alert-circle-outline" size={13} color={Colors.danger} />
            <Text style={s.errorText}>{errors.email}</Text>
          </View>
        )}
      </View>

      {/* Password field */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Пароль</Text>
        <View style={[
          s.inputRow,
          focused === 'password' && s.inputFocused,
          !!errors.password && s.inputError,
        ]}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={focused === 'password' ? Colors.primary : Colors.textMuted}
          />
          <TextInput
            style={s.input}
            value={values.password}
            onChangeText={setField('password')}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
          />
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
        </View>
        {!!errors.password && (
          <View style={s.errorRow}>
            <Ionicons name="alert-circle-outline" size={13} color={Colors.danger} />
            <Text style={s.errorText}>{errors.password}</Text>
          </View>
        )}
      </View>

      {/* Forgot password */}
      {onForgotPassword && (
        <TouchableOpacity
          style={s.forgotBtn}
          onPress={onForgotPassword}
          activeOpacity={0.7}
        >
          <Text style={s.forgotText}>Забыли пароль?</Text>
        </TouchableOpacity>
      )}

      {/* Server error */}
      {!!serverError && (
        <View style={s.serverError}>
          <Ionicons name="alert-circle-outline" size={15} color={Colors.danger} />
          <Text style={s.serverErrorText}>{serverError}</Text>
        </View>
      )}

      {/* Submit button */}
      <TouchableOpacity
        style={[s.submitBtn, loading && s.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={Colors.surface} size="small" />
        ) : (
          <Text style={s.submitBtnText}>Войти</Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  fieldWrap: {
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 10
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  inputError: {
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
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
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
