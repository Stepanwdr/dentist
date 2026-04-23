import { StyleSheet, Platform, Dimensions } from 'react-native';
import { bookingColors as C } from '@shared/theme/Booking.colors';

const ACTION_W  = 70;
const ACTIONS_W = ACTION_W * 3;

const sh = (color = '#000', op = 0.10, r = 10, y = 4) =>
  Platform.select({
    ios:     { shadowColor: color, shadowOffset: { width: 0, height: y }, shadowOpacity: op, shadowRadius: r },
    android: { elevation: Math.max(2, Math.round(r * 0.55)) },
  }) ?? {};

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.white },

  // ── Header ──
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 16,
    paddingBottom:     12,
    backgroundColor:   C.white,
    borderBottomWidth: 1,
    borderColor:       C.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  countBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countTxt:    { fontSize: 12, fontWeight: '700' },

  // ── Tab bar ──
  tabBar: {
    flexDirection:     'row',
    paddingHorizontal: 16,
    paddingVertical:   10,
    gap:               8,
    backgroundColor:   C.white,
  },
  tabBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    paddingHorizontal: 14,
    paddingVertical:   8,
    borderRadius:      20,
    backgroundColor:   C.bg,
    borderWidth:       1.5,
    borderColor:       C.border,
  },
  tabBtnActive:      { backgroundColor: C.skyTop, borderColor: C.skyTop },
  tabTxt:            { fontSize: 13, fontWeight: '600', color: C.textSub },
  tabTxtActive:      { color: '#fff' },
  tabCount: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor:  C.border,
    alignItems:       'center',
    justifyContent:   'center',
  },
  tabCountActive:    { backgroundColor: 'rgba(255,255,255,0.3)' },
  tabCountTxt:       { fontSize: 10, fontWeight: '800', color: C.textSub },
  tabCountTxtActive: { color: '#fff' },

  // ── Hint ──
  hint:    { paddingHorizontal: 16, paddingBottom: 4 },
  hintTxt: { fontSize: 11, color: C.textMuted },

  // ── List ──
  listContent: { paddingHorizontal: 12, paddingTop: 8, gap: 10 },

  // ── Swipe row ──
  swipeWrap: { position: 'relative', borderRadius: 18, overflow: 'hidden' },
  actions: {
    position:      'absolute',
    right: 0, top: 0, bottom: 0,
    flexDirection: 'row',
    width:         ACTIONS_W,
  },
  action: {
    width:          ACTION_W,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            3,
  },
  actionIcon: { fontSize: 18,color:"white" },
  actionLbl:  { fontSize: 9, fontWeight: '700', color: '#fff' },

  // ── Card ──
  card: {
    flexDirection:   'row',
    backgroundColor: C.white,
    borderRadius:    18,
    overflow:        'hidden',
    borderWidth:     1,
    borderColor:     C.border,
    ...sh('#000', 0.06, 10, 3),
  },
  cardAccent: { width: 4 },
  cardBody:   { flex: 1, padding: 13 },
  cardRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },

  dateBadge: {
    borderRadius:   12,
    padding:        8,
    minWidth:       44,
    alignItems:     'center',
    justifyContent: 'center',
  },
  dateNum:    { fontSize: 18, fontWeight: '900', color: '#fff', lineHeight: 20 },
  dateMon:    { fontSize: 9,  color: 'rgba(255,255,255,0.8)' },

  doctorName: { flex: 1, fontSize: 13, fontWeight: '700', color: C.text },
  serviceTxt: { fontSize: 11, color: C.textSub },
  roomTxt:    { fontSize: 10, color: C.textMuted, marginTop: 1 },

  pill: {
    paddingHorizontal: 7,
    paddingVertical:   3,
    borderRadius:      7,
  },
  pillTxt: { fontSize: 16, fontWeight: '700', textAlign:"right" },
  chevron: { fontSize: 18, color: C.border, marginLeft: 4 },

  // ── Rebook ──
  rebookBtn: {
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      10,
    backgroundColor:   C.skyLight,
    marginLeft:        4,
  },
  rebookTxt: { fontSize: 10, fontWeight: '700', color: C.skyTop },

  // ── Empty ──
  emptyWrap:  { paddingVertical: 52, alignItems: 'center', gap: 8 },
  emptyIcon:  { fontSize: 40 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  emptyTxt:   { fontSize: 13, color: C.textMuted },
});

export { ACTION_W, ACTIONS_W };