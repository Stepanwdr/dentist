export interface Dentist {
  id: number;
  name: string;
  lname: string;
  fname: string;
  speciality?: string;
  clinicId?: string;
  avatar?: string;
  phone: string;
  address: string;
  clinic?: {
    id: string;
    name: string;
  };
}