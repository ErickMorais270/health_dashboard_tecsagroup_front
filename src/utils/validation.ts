export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateLoginFields(email: string, password: string): string | null {
  if (!email.trim()) {
    return 'Informe o e-mail.';
  }

  if (!isValidEmail(email)) {
    return 'E-mail inválido.';
  }

  if (!password) {
    return 'Informe a senha.';
  }

  return null;
}

export function validateRegisterFields(input: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): string | null {
  if (!input.name.trim()) {
    return 'Informe o nome.';
  }

  if (!input.email.trim()) {
    return 'Informe o e-mail.';
  }

  if (!isValidEmail(input.email)) {
    return 'E-mail inválido.';
  }

  if (input.password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.';
  }

  if (input.password !== input.password_confirmation) {
    return 'As senhas não coincidem.';
  }

  return null;
}

export function validateBiomarkerForm(input: {
  sleep_hours: string;
  glucose_level: string;
  heart_rate: string;
}): string | null {
  const sleep = Number(input.sleep_hours);
  const glucose = Number(input.glucose_level);
  const hr = Math.round(Number(input.heart_rate));

  if (Number.isNaN(sleep) || sleep < 0 || sleep > 24) {
    return 'Sono deve estar entre 0 e 24 horas.';
  }

  if (Number.isNaN(glucose) || glucose < 20 || glucose > 600) {
    return 'Glicose fora do intervalo aceito (20–600).';
  }

  if (Number.isNaN(hr) || hr < 30 || hr > 220) {
    return 'Frequência cardíaca deve estar entre 30 e 220 bpm.';
  }

  return null;
}
