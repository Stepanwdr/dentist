import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {API_BASE_URL, authApi} from "@shared/api";

WebBrowser.maybeCompleteAuthSession();

export interface GoogleAuthResult {
  success: boolean;
  error?: string;
  token?: string;
  user?: any;
}

export async function authWithGoogle(): Promise<GoogleAuthResult> {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "dentist",
      path: "auth/callback",
    });

    const authUrl = `http://cp5rdf-ip-217-76-10-15.tunnelmole.net/auth/google?state=${encodeURIComponent(redirectUri)}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "cancel") {
      return { success: false, error: "Вход отменён" };
    }

    if (result.type === "dismiss") {
      return { success: false, error: "Окно входа закрыто" };
    }

    if (result.type !== "success") {
      return { success: false, error: "Не удалось получить токен" };
    }

    const { url } = result;

    // Сервер вернул ошибку в URL
    if (url.includes("error=")) {
      const errMatch = url.match(/error=([^&]+)/);
      const errMsg = errMatch
        ? decodeURIComponent(errMatch[1])
        : "Ошибка авторизации";
      return { success: false, error: errMsg };
    }

    // Нет токена в URL
    if (!url.includes("token=")) {
      return { success: false, error: "Ответ не содержит токен" };
    }

    const tokenMatch = url.match(/token=([^&]+)/);
    const userMatch = url.match(/user=([^&#]+)/);

    if (!tokenMatch || !userMatch) {
      return { success: false, error: "Не удалось извлечь данные из ответа" };
    }

    const token = decodeURIComponent(tokenMatch[1]);
    const userStr = decodeURIComponent(userMatch[1]).replace(/#.*$/, "");
    const user = JSON.parse(userStr);

    await authApi.loginWithGoogle(token);

    return { success: true, token, user };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.detail ||
        error.message ||
        "Ошибка авторизации",
    };
  }
}