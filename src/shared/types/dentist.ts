export interface Dentist {
  id: string;
  name: string;
  lname: string;
  fname: string;
  speciality?: string;
  clinicId?: string;
  avatar?: string;
  phone: string;
  clinic?: {
    id: string;
    name: string;
  };
}