// src/entities/clinic/model/types.ts

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string | null;
  workingHours: string;
  description: string | null;
}
