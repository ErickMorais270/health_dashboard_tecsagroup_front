import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, type LoginInput, type RegisterInput } from '@/services/authApi';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, ONBOARDING_KEY } from '@/services/api/http';
import type { ApiUser } from '@/services/api/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  user: ApiUser | null;
  token: string | null;
  isBootstrapping: boolean;
  hasSeenOnboarding: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [storedToken, storedUser, onboardingFlag] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
          AsyncStorage.getItem(ONBOARDING_KEY),
        ]);

        if (storedToken) {
          setToken(storedToken);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser) as ApiUser);
        }

        setHasSeenOnboarding(onboardingFlag === '1');
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, []);

  const persistSession = useCallback(async (payload: { token: string; user: ApiUser }) => {
    setToken(payload.token);
    setUser(payload.user);
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, payload.token);
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user));
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const data = await loginUser(input);
      await persistSession({ token: data.token, user: data.user });
    },
    [persistSession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const data = await registerUser(input);
      await persistSession({ token: data.token, user: data.user });
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  }, []);

  const completeOnboarding = useCallback(async () => {
    setHasSeenOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isBootstrapping,
      hasSeenOnboarding,
      login,
      register,
      logout,
      completeOnboarding,
    }),
    [completeOnboarding, hasSeenOnboarding, isBootstrapping, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
