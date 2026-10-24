/**
 * Validadores de CPF e CNPJ (brasileiros).
 * Implementação pura, sem dependências externas. Solução gratuita.
 */

export type DocumentoTipo = 'CPF' | 'CNPJ';

export function validarCPF(cpf: string): boolean {
  const s = cpf.replace(/\D/g, '');
  if (s.length !== 11 || /^(\d)\1{10}$/.test(s)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(s[i]) * (10 - i);
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  if (Number(s[9]) !== digito1) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(s[i]) * (11 - i);
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  return Number(s[10]) === digito2;
}

export function validarCNPJ(cnpj: string): boolean {
  const s = cnpj.replace(/\D/g, '');
  if (s.length !== 14 || /^(\d)\1{13}$/.test(s)) return false;

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let soma = 0;
  for (let i = 0; i < 12; i++) soma += Number(s[i]) * pesos1[i];
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  if (Number(s[12]) !== digito1) return false;

  soma = 0;
  for (let i = 0; i < 13; i++) soma += Number(s[i]) * pesos2[i];
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  return Number(s[13]) === digito2;
}

export function validarDocumento(tipo: DocumentoTipo, valor: string): boolean {
  const limpo = valor.replace(/\D/g, '');
  if (tipo === 'CPF') return validarCPF(limpo);
  if (tipo === 'CNPJ') return validarCNPJ(limpo);
  return false;
}

export function formatarCPF(cpf: string): string {
  const s = cpf.replace(/\D/g, '');
  return s.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatarCNPJ(cnpj: string): string {
  const s = cnpj.replace(/\D/g, '');
  return s.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatarDocumento(tipo: DocumentoTipo, valor: string): string {
  if (tipo === 'CPF') return formatarCPF(valor);
  if (tipo === 'CNPJ') return formatarCNPJ(valor);
  return valor;
}

export function mascaraDocumento(tipo: DocumentoTipo): string {
  return tipo === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00';
}
