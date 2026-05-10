/**
 * Comparação por dia civil no fuso local (alinhado ao `created_at` do servidor em ISO 8601).
 */

export function isoToLocalDayKey(iso: string): string {
  const d = new Date(iso);
  return dateToLocalDayKey(d);
}

export function dateToLocalDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatBrazilDateFromIso(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatBrazilTimeFromIso(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Formata um `Date` local (ex.: dia escolhido no picker) sem passar por UTC. */
export function formatBrazilDateLocal(d: Date): string {
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
