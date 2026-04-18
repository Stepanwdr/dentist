import {Platform} from "react-native";

export const CARD_RADIUS = 20;

export const SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  android: { elevation: 8 },
});

export const SHADOW_SM = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
});

export const HomeColor = {
  // Sky blue primary
  primary:     '#4A9FF5',
  primaryDark: '#2D7DD2',
  primaryLight:'#EFF6FF',
  // Pink accent (NEXT badge / teal date)
  pink:        '#FF4D7D',
  pinkLight:   '#FFE4ED',
  // Teal accent
  teal:        '#4DD9AC',
  tealDark:    '#2BB894',
  tealLight:   '#ECFDF5',
  // Neutrals
  bg:          '#E8F4FF',
  white:       '#FFFFFF',
  text:        '#0F172A',
  textSub:     '#64748B',
  textMuted:   '#94A3B8',
  border:      '#E2E8F0',
  // Misc
  green:       '#22C55E',
};
