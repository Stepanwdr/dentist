import React, { createContext,  useEffect, useState } from "react";
import {type AuthUser, baseApi} from "@shared/api";
import {tokenStorage} from "@shared/lib/tokenStorage";
import {navigate} from "@app/navigation/navigationRef";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string,refresh:string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);


  // авто логин
  useEffect(() => {
    const init = async () => {
      const savedToken = await tokenStorage.getAccessToken();
      const savedRefreshToken = await tokenStorage.getRefreshToken();
      if (savedToken) {
        setToken(savedToken);
        try {
          const me = await baseApi.get<AuthUser>("/users/account");

          setUser(me);
        } catch {
          await tokenStorage.clearTokens();
        }
      }

      setLoading(false);
    };

    init();
  }, []);



  const login = async (token: string, refresh:string, user: AuthUser) => {
    setToken(token);
    setUser(user);
    await tokenStorage.saveTokens(token, refresh );
  };

  const logout = async () => {
    setToken(null);
    setUser(null);

    await tokenStorage.clearTokens();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
