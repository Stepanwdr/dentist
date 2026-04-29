import React, {useState} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScheduleScreen from "./ui/ScheduleScreen";
import PatientsScreen from "@app/navigation/dentist/ui/PatientsScreen";
import {CustomTabBar, Icons} from "@widgets/CustomTabBar/CustomTabBar";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {TabParamList} from "@app/navigation/types";
import {ProfilePage} from "@screens/profile";
import {View} from "react-native";

import { Header } from "./ui/Header";
import {DentistDashboard} from "@app/navigation/dentist/DentistDashboard";
import {bookingColors} from "@shared/theme/Booking.colors";
import {Drawer} from "@shared/ux/Drawer";
import {Notifications} from "@widgets/notifications/ui/Notifications";
import {BookingsScreen} from "@screens/bookings";

const dentistIcons: Icons = {
  HomeTab:       { active: 'home',         inactive: 'home-outline',     label: 'Главная'   },
  ScheduleTab:   { active: 'calendar',     inactive: 'calendar-outline', label: 'Расписание'   },
  PatientsTab:   { active: 'people',       inactive: 'people-outline',   label: 'Пациенты'   },
  BookingsTab:   { active: 'list',         inactive: 'list-outline',     label: 'Записи' },
  ProfileTab:    { active: 'person',       inactive: 'person-outline',   label: 'Профиль'   },
};
type DentistParamList = {
  HomeTab: undefined;
  ScheduleTab: undefined;
  PatientsTab: { patientId?: string | number } | undefined;
  TreatmentsTab:undefined;
  ProfileTab:undefined;
  BookingsTab:undefined
};
const Tab = createBottomTabNavigator<TabParamList>();

const Stack = createNativeStackNavigator<DentistParamList>();

export const DentistTabs: React.FC = () => {
  const [openNotifModal,setOpenNotifModal] = useState(false);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar icons={dentistIcons} {...props} />}
      screenLayout={({ children }) => (
        <View style={{ flex: 1,backgroundColor:bookingColors.skyLight}}>
          <Header onToggle={()=>setOpenNotifModal(prev => !prev)} isOpen={openNotifModal}/>
            {children}
          <Drawer visible={openNotifModal} onClose={() => setOpenNotifModal(prev => !prev)}>
            <Notifications />
          </Drawer>
       </View>
    )}
    >
      <Stack.Screen name="HomeTab"     component={DentistDashboard}/>
      <Stack.Screen name="ScheduleTab" component={ScheduleScreen}  />
      <Stack.Screen name="PatientsTab" component={PatientsScreen}  />
      <Stack.Screen name="BookingsTab" component={BookingsScreen}  />
      <Stack.Screen name="ProfileTab"  component={ProfilePage}     />
    </Tab.Navigator>
  );
};

export default DentistTabs;
