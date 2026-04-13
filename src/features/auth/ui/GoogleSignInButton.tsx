// src/features/auth/ui/GoogleSignInButton.tsx
import React from 'react';
import {
  TouchableOpacity, Text, View,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Colors } from '@shared/theme/colors';

interface GoogleSignInButtonProps {
  loading: boolean;
  onPress: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  loading, onPress,
}) => (
  <TouchableOpacity
    style={styles.btn}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
  >
    {loading ? (
      <ActivityIndicator color={Colors.textSecondary} size="small" />
    ) : (
      <>
        {/* Google G лого через SVG-path (нет нужды в картинке) */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>G</Text>
        </View>
        <Text style={styles.label}>Войти через Google</Text>
      </>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    height: 54,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
});
