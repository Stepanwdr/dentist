import { View ,Text,StyleSheet} from "react-native";
import { bookingColors } from "@shared/theme/Booking.colors";

export const EmptyData = ()=>{
  return(<View style={s.emptyWrap}>
    <Text style={s.emptyIcon}>📋</Text>
    <Text style={s.emptyTitle}>Нет доступных слотов на сегодня</Text>
    <Text style={s.emptyTxt}>Выбирайте другой день</Text>
  </View>)
}

const s =StyleSheet.create({
  emptyWrap:  { paddingVertical: 52, alignItems: 'center', gap: 8 },
  emptyIcon:  { fontSize: 40 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: bookingColors.text },
  emptyTxt:   { fontSize: 13, color: bookingColors.textMuted },
})