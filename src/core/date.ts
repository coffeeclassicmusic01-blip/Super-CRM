/**
 * Utilitários de data. Todas as datas internas são ISO 8601 (YYYY-MM-DD).
 * Conversão para exibição em pt-BR usa date-fns ou Intl nativo.
 * Nenhuma conversão manual de calendário (boas práticas de wordcraft/gridcraft).
 */
import { ok, err, type Result } from './result';

export type DateISO = string & { __brand: 'DateISO' };

export function nowISO(): DateISO {
  return new Date().toISOString().slice(0, 10) as DateISO;
}

export function parseDateISO(value: string): Result<DateISO> {
  const d = new Date(value + 'T00:00:00');
  if (!Number.isFinite(d.getTime())) return err('Data inválida');
  const iso = d.toISOString().slice(0, 10);
  if (iso !== value) return err('Data deve estar no formato YYYY-MM-DD');
  return ok(iso as DateISO);
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

export function addDays(iso: string, days: number): DateISO {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10) as DateISO;
}

export function isBefore(a: string, b: string): boolean {
  return a < b;
}

export function isAfter(a: string, b: string): boolean {
  return a > b;
}
