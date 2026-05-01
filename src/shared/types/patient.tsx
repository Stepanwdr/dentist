export interface Patient {
  id: number;
  name: string;
  lname: string;
  fname: string;
  clinicId?: string;
  avatar?: string;
  phone: string;
  address: string;
  dentistId?: number;
  email: string;
  clinic?: {
    id: string;
    name: string;
  };
}