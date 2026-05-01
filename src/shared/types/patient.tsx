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
  clinic?: {
    id: string;
    name: string;
  };
}