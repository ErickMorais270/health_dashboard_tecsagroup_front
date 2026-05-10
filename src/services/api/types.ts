export type ApiUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthPayload = {
  user: ApiUser;
  token: string;
  token_type: 'Bearer';
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiErrorBody = {
  success: false;
  message: string;
  errors: Record<string, string[]>;
};

export type HealthRecommendation = {
  id: number;
  biomarker_id: number | null;
  recommendations: string[];
  created_at: string;
};

export type Biomarker = {
  id: number;
  sleep_hours: number;
  glucose_level: number;
  heart_rate: number;
  created_at: string;
  updated_at?: string;
  /** Present quando a API incluir (dashboard / listagem com IA por medição). */
  health_recommendation?: HealthRecommendation | null;
};

export type BiomarkerCreateResponse = {
  biomarker: Biomarker;
  health_recommendation: HealthRecommendation;
};

export type DashboardData = {
  biomarkers: Biomarker[];
  /** Última recomendação global (redundante com o último biomarcador; mantido para compatibilidade). */
  current_recommendation: Pick<HealthRecommendation, 'id' | 'biomarker_id' | 'recommendations' | 'created_at'> | null;
};
