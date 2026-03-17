// // src/shared/config/firebase.ts
// import Constants from 'expo-constants';
// import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
// import { getAuth, Auth } from 'firebase/auth';
//
// let app: FirebaseApp;
// let auth: Auth;
//
// export function getFirebaseApp(): FirebaseApp {
//   if (!app) {
//     const cfg = (Constants.expoConfig?.extra as any)?.firebase;
//     if (!cfg) {
//       throw new Error('Firebase config is missing in app.json -> expo.extra.firebase');
//     }
//     app = getApps().length ? getApps()[0]! : initializeApp(cfg);
//   }
//   return app;
// }
//
// export function getFirebaseAuth(): Auth {
//   if (!auth) {
//     auth = getAuth(getFirebaseApp());
//   }
//   return auth;
// }
