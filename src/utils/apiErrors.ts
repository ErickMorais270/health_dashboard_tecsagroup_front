import { API_BASE_URL } from '@/services/api/http';
import { isAxiosError } from 'axios';
import { Platform } from 'react-native';

const NETWORK_DEV_HINT =
  'Sem conexão com a API. Use a mesma Wi‑Fi do PC. Se o Laravel roda no WSL, a porta 8000 no IP do Windows (192.168.x.x) precisa ser encaminhada ao WSL (PowerShell admin: netsh interface portproxy) ou rode o PHP no Windows. Confira EXPO_PUBLIC_API_URL e firewall.';

const NETWORK_PROD_HINT =
  'Não foi possível alcançar a API. No painel do Render (Static Site), defina EXPO_PUBLIC_API_URL com a URL HTTPS do backend incluindo /api (ex.: https://health-dashboard-tecsagroup-back.onrender.com/api), salve e faça um novo deploy do front — esse valor entra no build. URL atual do app: ';

function isLikelyLocalApiBase(url: string): boolean {
  return (
    url.includes('127.0.0.1') ||
    url.includes('localhost') ||
    url.includes('10.0.2.2') ||
    /http:\/\/192\.168\./.test(url) ||
    /http:\/\/172\.(1[6-9]|2\d|3[01])\./.test(url)
  );
}

/** Página servida em HTTPS num host público (ex.: Render), não no dev local. */
function isHttpsPublicWeb(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }
  const { hostname, protocol } = window.location;
  if (protocol !== 'https:') {
    return false;
  }
  return hostname !== 'localhost' && hostname !== '127.0.0.1';
}

const BUNDLE_STILL_LOCAL_ON_PROD =
  'Este site está no ar em HTTPS, mas o JavaScript foi gerado apontando para uma API local (' +
  API_BASE_URL +
  '). No Render (Static Site) adicione EXPO_PUBLIC_API_URL=https://SEU-BACK.onrender.com/api, salve e faça um novo deploy (Build & deploy). O valor só entra no bundle na hora do npm run export:web.';

function networkUnreachableMessage(): string {
  if (isHttpsPublicWeb() && isLikelyLocalApiBase(API_BASE_URL)) {
    return BUNDLE_STILL_LOCAL_ON_PROD;
  }

  if (isLikelyLocalApiBase(API_BASE_URL)) {
    return NETWORK_DEV_HINT;
  }

  return `${NETWORK_PROD_HINT}${API_BASE_URL}`;
}

export function getAxiosErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data;
  if (data && typeof data === 'object') {
    const body = data as { message?: string; errors?: Record<string, string[]> };
    if (typeof body.message === 'string' && body.message.trim() !== '') {
      return body.message;
    }

    const firstField = body.errors ? Object.values(body.errors)[0] : undefined;
    const firstMsg = Array.isArray(firstField) ? firstField[0] : undefined;
    if (typeof firstMsg === 'string' && firstMsg.trim() !== '') {
      return firstMsg;
    }
  }

  if (error.response === undefined || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return networkUnreachableMessage();
  }

  return fallback;
}
