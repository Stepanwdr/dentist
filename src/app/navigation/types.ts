// src/app/navigation/types.ts

export type RootStackParamList = {
  Services: undefined;
  Doctors: { serviceId: string };
  Booking: undefined;
  Confirmation: { appointmentId: string };
  Auth: undefined;
  Register: undefined;
};

export type TabParamList = {
  BookingTab: undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
};
