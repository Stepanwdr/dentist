export type BookingStackParamList = {
  Services: { dentistId?: string };
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
  BookingTab: { dentistId?: number } | undefined;
  AppointmentsTab: undefined;
  ProfileTab: undefined;
  Doctors: { dentistId: string };
};
