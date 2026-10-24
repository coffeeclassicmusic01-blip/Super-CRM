// Exportações públicas da camada L0 Core
export type { Result, Ok, Err } from './result';
export { ok, err, isOk, isErr, unwrapOr, safe, safeSync } from './result';
export type { Money } from './money';
export {
  money,
  fromReais,
  toReais,
  add,
  subtract,
  multiply,
  divide,
  formatMoneyBRL,
  parseMoneyBRL,
  zero,
  isPositive,
} from './money';
export type { DocumentId } from './id';
export { newId, isValidId, extractYear } from './id';
export type { DateISO } from './date';
export {
  nowISO,
  parseDateISO,
  formatDateBR,
  addDays,
  isBefore,
  isAfter,
} from './date';
export type { DocumentoTipo } from './cpf-cnpj';
export {
  validarCPF,
  validarCNPJ,
  validarDocumento,
  formatarCPF,
  formatarCNPJ,
  formatarDocumento,
  mascaraDocumento,
} from './cpf-cnpj';
