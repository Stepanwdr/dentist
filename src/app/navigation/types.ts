import {NavigatorScreenParams} from "@react-navigation/native";
export type BookingStackParamList = {
  Services: undefined;
  Time: { dentistId?: string };
  Success: undefined;
};

export type RootStackParamList = {
  Services: undefined;
  Booking: { dentistId: string };
  Confirmation: { appointmentId: string };
  Auth: undefined;
  Register: undefined;
  Profile: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  DoctorsTab: undefined;
  BookingTab: NavigatorScreenParams<BookingStackParamList>;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
  Doctors: { dentistId: string };
};