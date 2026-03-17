import { useState, useCallback } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { tokenStorage } from '@shared/lib/tokenStorage';
import { useAuthStore } from './authStore';
import {authApi} from "@shared/api";

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useAuthStore();

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await GoogleSignin.hasPlayServices();

      // v13: signIn() возвращает SignInResponse без idToken
      await GoogleSignin.signIn();

      // idToken берём отдельно через getTokens()
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) throw new Error('Google idToken не получен');

      // const { user, tokens } = await authApi.loginWithGoogle(idToken);
      // await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);

      // dispatch({
      //   type: 'SET_USER',
      //   payload: {
      //     uid: user.id,
      //     phone: user.phone,
      //     email: user.email,
      //     displayName: user.name,
      //     photoURL: null,
      //     idToken: tokens.accessToken,
      //   },
      // });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка входа через Google');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { loading, error, signIn };
}