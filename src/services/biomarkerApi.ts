import type { ApiSuccess, Biomarker, BiomarkerCreateResponse } from '@/services/api/types';
import { http } from '@/services/api/http';
import { getAxiosErrorMessage } from '@/utils/apiErrors';

export type BiomarkerInput = {
  sleep_hours: number;
  glucose_level: number;
  heart_rate: number;
};

export async function listBiomarkers(): Promise<Biomarker[]> {
  const { data } = await http.get<ApiSuccess<Biomarker[]>>('/biomarkers');
  return data.data;
}

export async function createBiomarker(input: BiomarkerInput): Promise<BiomarkerCreateResponse> {
  try {
    const { data } = await http.post<ApiSuccess<BiomarkerCreateResponse>>('/biomarkers', input);
    return data.data;
  } catch (error) {
    throw new Error(getAxiosErrorMessage(error, 'Não foi possível salvar o biomarcador.'));
  }
}
