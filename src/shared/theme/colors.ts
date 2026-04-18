// src/shared/config/colors.ts

export const Colors = {
  primary: '#4A9FF5',
  primaryLight: '#EBF3FF',
  primaryDim: '#93B8E4',

  success: '#65ff9b',
  successDark: '#004c19',
  successLight: '#F0FDF4',

  warning: '#F59E0B',
  warningLight: '#FFFBEB',

  danger: '#EF4444',
  dangerLight: '#FEF2F2',

  accent: '#E05C5C',

  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9BA3AF',
  textDisabled: '#D1D5DB',

  background: '#F5F7FB',
  surface: '#FFFFFF',

  border: '#E5E7EB',
  borderLight: '#F0F2F5',
  separator: '#F3F4F6',
} as const;

export type ColorKey = keyof typeof Colors;
