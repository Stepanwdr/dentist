// // src/features/auth/model/authStore.tsx
// import React, {
//   createContext, useContext, useReducer,
//   useEffect, ReactNode,
// } from 'react';
// import { AuthUser } from '@entities/user';
// import { auth } from '@entities/user';
// import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
//
// // ─── State ────────────────────────────────────────────────────────────────────
//
// type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
//
// interface AuthState {
//   status: AuthStatus;
//   user: AuthUser | null;
//   error: string | null;
// }
//
// const initialState: AuthState = {
//   status: 'idle',
//   user: null,
//   error: null,
// };
//
// // ─── Actions ──────────────────────────────────────────────────────────────────
//
// type AuthAction =
//   | { type: 'SET_LOADING' }
//   | { type: 'SET_USER'; payload: AuthUser }
//   | { type: 'CLEAR_USER' }
//   | { type: 'SET_ERROR'; payload: string }
//   | { type: 'CLEAR_ERROR' };
//
// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, status: 'loading', error: null };
//     case 'SET_USER':
//       return { status: 'authenticated', user: action.payload, error: null };
//     case 'CLEAR_USER':
//       return { status: 'unauthenticated', user: null, error: null };
//     case 'SET_ERROR':
//       return { ...state, status: 'unauthenticated', error: action.payload };
//     case 'CLEAR_ERROR':
//       return { ...state, error: null };
//     default:
//       return state;
//   }
// }
//
// // ─── Context ──────────────────────────────────────────────────────────────────
//
// interface AuthContextValue {
//   state: AuthState;
//   dispatch: React.Dispatch<AuthAction>;
// }
//
//  const AuthContext = createContext<AuthContextValue | null>(null);
//
// // ─── Provider ─────────────────────────────────────────────────────────────────
//
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);
//
//   useEffect(() => {
//     dispatch({ type: 'SET_LOADING' });
//
//     // Подписка на изменения сессии Firebase
//     const unsubscribe = auth().onAuthStateChanged(
//       async (firebaseUser: FirebaseAuthTypes.User | null) => {
//         if (!firebaseUser) {
//           dispatch({ type: 'CLEAR_USER' });
//           return;
//         }
//         try {
//           const idToken = await firebaseUser.getIdToken();
//           dispatch({
//             type: 'SET_USER',
//             payload: {
//               uid: firebaseUser.uid,
//               phone: firebaseUser.phoneNumber,
//               email: firebaseUser.email,
//               displayName: firebaseUser.displayName,
//               photoURL: firebaseUser.photoURL,
//               idToken,
//             },
//           });
//         } catch {
//           dispatch({ type: 'CLEAR_USER' });
//         }
//       },
//     );
//
//     return unsubscribe;
//   }, []);
//
//   return (
//     <AuthContext.Provider value={{ state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
//
// // ─── Hook ─────────────────────────────────────────────────────────────────────
//
// export function useAuthStore(): AuthContextValue {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuthStore must be inside AuthProvider');
//   return ctx;
// }
