/**
 * Utilitários de moeda (BRL). Extraído dos padrões de GeoStudio (money, moneyFull).
 * Todos os cálculos financeiros usam centavos (inteiros) internamente para evitar
 * erros de ponto flutuante. A exibição usa toLocaleString('pt-BR').
 */
import { ok, err, type Result } from './result';

export type Money = { cents: number; currency?: string };

export function money(cents: number, currency = 'BRL'): Money {
  return { cents: Math.round(cents), currency };
}

export function fromReais(reais: number): Money {
  return money(Math.round(reais * 100));
}

export function toReais(m: Money): number {
  return m.cents / 100;
}

export function add(...ms: Money[]): Money {
  return money(ms.reduce((s, m) => s + m.cents, 0), ms[0]?.currency);
}

export function subtract(a: Money, b: Money): Money {
  return money(a.cents - b.cents, a.currency);
}

export function multiply(m: Money, factor: number): Money {
  return money(Math.round(m.cents * factor), m.currency);
}

export function divide(m: Money, divisor: number): Result<Money> {
  if (divisor === 0) return err('Divisão por zero');
  return ok(money(Math.round(m.cents / divisor), m.currency));
}

export function formatMoneyBRL(m: Money, options: { showCents?: boolean } = {}): string {
  const reais = toReais(m);
  return reais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: m.currency ?? 'BRL',
    minimumFractionDigits: options.showCents ? 2 : 0,
    maximumFractionDigits: options.showCents ? 2 : 0,
  });
}

export function parseMoneyBRL(text: string): Result<Money> {
  const cleaned = text.replace(/[R$\s.]/g, '').replace(',', '.');
  const value = parseFloat(cleaned);
  if (!Number.isFinite(value)) return err('Valor monetário inválido');
  return ok(fromReais(value));
}

export function zero(): Money {
  return money(0);
}

export function isPositive(m: Money): boolean {
  return m.cents > 0;
}
