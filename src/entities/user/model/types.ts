// src/entities/user/model/types.ts

export interface AuthUser {
  uid: string;
  phone: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  /** Firebase ID Token — прокидывается в Authorization header */
  idToken: string;
}
