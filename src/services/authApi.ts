import type { ApiSuccess, AuthPayload } from '@/services/api/types';
import { http } from '@/services/api/http';
import { getAxiosErrorMessage } from '@/utils/apiErrors';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput): Promise<AuthPayload> {
  try {
    const { data } = await http.post<ApiSuccess<AuthPayload>>('/register', input);
    return data.data;
  } catch (error) {
    throw new Error(getAxiosErrorMessage(error, 'Não foi possível cadastrar.'));
  }
}

export async function loginUser(input: LoginInput): Promise<AuthPayload> {
  try {
    const { data } = await http.post<ApiSuccess<AuthPayload>>('/login', input);
    return data.data;
  } catch (error) {
    throw new Error(getAxiosErrorMessage(error, 'Não foi possível entrar.'));
  }
}
