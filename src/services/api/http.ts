import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AUTH_TOKEN_KEY = 'healthdash.auth.token';
export const AUTH_USER_KEY = 'healthdash.auth.user';
export const ONBOARDING_KEY = 'healthdash.onboarding.done';

/**
 * Laravel expõe rotas sob o prefixo `/api`. Muitos configuram só a origem no Render
 * (`https://….onrender.com`) — sem isso o Axios chamaria `/register` em vez de `/api/register`.
 */
export function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }
  return `${trimmed}/api`;
}

/** Base da API (sempre termina em `/api`). No Render: pode ser só a origem HTTPS do back; o sufixo é aplicado aqui. */
export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api',
);

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 60_000,
});

http.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
