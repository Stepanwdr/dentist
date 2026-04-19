// // src/features/auth/model/usePhoneAuth.ts
// import { useState, useCallback } from 'react';
// import { auth } from '@entities/user';
// import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
//
// type PhoneStep = 'input' | 'otp' | 'done';
//
// interface UsePhoneAuthReturn {
//   step: PhoneStep;
//   loading: boolean;
//   error: string | null;
//   sendCode: (phoneNumber: string) => Promise<void>;
//   confirmCode: (code: string) => Promise<void>;
//   reset: () => void;
// }
//
// export function usePhoneAuth(): UsePhoneAuthReturn {
//   const [step, setStep] = useState<PhoneStep>('input');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [confirm, setConfirm] =
//     useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
//
//   const sendCode = useCallback(async (phoneNumber: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await auth().signInWithPhoneNumber(phoneNumber);
//       setConfirm(result);
//       setStep('otp');
//     } catch (e: unknown) {
//       setError(mapFirebaseError(e));
//     } finally {
//       setLoading(false);
//     }
//   }, []);
//
//   const confirmCode = useCallback(async (code: string) => {
//     if (!confirm) return;
//     setLoading(true);
//     setError(null);
//     try {
//       await confirm.confirm(code);
//       setStep('done');
//     } catch (e: unknown) {
//       setError(mapFirebaseError(e));
//     } finally {
//       setLoading(false);
//     }
//   }, [confirm]);
//
//   const reset = useCallback(() => {
//     setStep('input');
//     setError(null);
//     setConfirm(null);
//   }, []);
//
//   return { step, loading, error, sendCode, confirmCode, reset };
// }
//
// // ─── Хелпер ───────────────────────────────────────────────────────────────────
//
// function mapFirebaseError(e: unknown): string {
//   if (typeof e === 'object' && e !== null && 'code' in e) {
//     const code = (e as { code: string }).code;
//     const messages: Record<string, string> = {
//       'auth/invalid-phone-number': 'Неверный формат номера телефона',
//       'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
//       'auth/invalid-verification-code': 'Неверный код из СМС',
//       'auth/code-expired': 'Код устарел. Запросите новый',
//       'auth/quota-exceeded': 'Превышен лимит запросов',
//     };
//     return messages[code] ?? `Ошибка: ${code}`;
//   }
//   return 'Неизвестная ошибка. Попробуйте снова';
// }
