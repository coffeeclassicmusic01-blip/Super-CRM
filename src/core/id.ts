/**
 * Identificadores de documento. Padroniza geração e validação de IDs
 * usados em clientes, parceiros, orçamentos, projetos, faturas, etc.
 */

export type DocumentId = string & { __brand: 'DocumentId' };

const ID_PREFIX = /^[A-Z]{2,4}-\d{4,}$/;

export function newId(prefix: string): DocumentId {
  const now = new Date();
  const year = now.getFullYear();
  const seq = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${prefix}-${year}-${seq}` as DocumentId;
}

export function isValidId(id: string): boolean {
  return ID_PREFIX.test(id);
}

export function extractYear(id: string): number | null {
  const m = id.match(/-(\d{4})-/);
  return m ? parseInt(m[1], 10) : null;
}
