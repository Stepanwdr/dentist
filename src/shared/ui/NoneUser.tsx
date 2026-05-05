import {Ionicons} from "@expo/vector-icons";
import { bookingColors } from "@shared/theme/Booking.colors";
import {View} from "react-native";

export const NoneUser = () => {
  return (
    <View style={{alignItems:'center'}}><Ionicons color={bookingColors.border} name={'person-outline'} size={80} /></View>
  );
};