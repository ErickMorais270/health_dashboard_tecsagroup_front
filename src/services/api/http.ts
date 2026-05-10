import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AUTH_TOKEN_KEY = 'healthdash.auth.token';
export const AUTH_USER_KEY = 'healthdash.auth.user';
export const ONBOARDING_KEY = 'healthdash.onboarding.done';

/** Base da API (Laravel /api). Build web no Render: definir EXPO_PUBLIC_API_URL (ex.: https://….onrender.com/api). */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export const http = axios.create({
  baseURL: API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL,
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
