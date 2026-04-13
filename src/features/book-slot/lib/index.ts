import {Dimensions, Platform, StyleSheet} from "react-native";

export const dk  = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

export function addMin(t: string, m: number): string {
  const [h, mm] = t.split(':').map(Number);
  const tot = h * 60 + mm + m;
  return `${String(Math.floor(tot/60)).padStart(2,'0')}:${String(tot%60).padStart(2,'0')}`;
}

export function stableRng(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

export const DAY_W = 52;
export const DAY_G = 8;
export const DAYS_SHORT   = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];

const { width: SW } = Dimensions.get('window');

export const shadow = (color = '#000', op = 0.12, r = 10, y = 4) =>
  Platform.select({
    ios:     { shadowColor: color, shadowOffset: { width: 0, height: y }, shadowOpacity: op, shadowRadius: r },
    android: { elevation: Math.max(2, Math.round(r * 0.55)) },
  }) ?? {};

export const SLOT_W = Math.floor((SW - 32 - 10) / 2);
