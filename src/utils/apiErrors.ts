import { isAxiosError } from 'axios';

const NETWORK_HINT =
  'Sem conexão com a API. Use a mesma Wi‑Fi do PC. Se o Laravel roda no WSL, a porta 8000 no IP do Windows (192.168.x.x) precisa ser encaminhada ao WSL (PowerShell admin: netsh interface portproxy) ou rode o PHP no Windows. Confira EXPO_PUBLIC_API_URL e firewall.';

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
    return NETWORK_HINT;
  }

  return fallback;
}
