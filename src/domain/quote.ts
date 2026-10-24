/**
 * Entidade Orçamento (Módulos 2, 4, 6).
 * Versionamento (v1, v2, v3) com log de motivos, validade, termos, itens dinâmicos.
 * Expansão para M3 (templates) e M4 (revisões, pré-nota).
 */

import type { Template } from './template';

export type QuoteStatus =
  | 'rascunho'
  | 'enviado'
  | 'em_negociacao'
  | 'aprovado'
  | 'perdido'
  | 'cancelado';

export type QuoteItem = {
  descricao: string;
  quantidade: number;
  unidade: string; // UN, M, M², M³, KG, L, CX, RL, PC
  valorUnitarioCents: number;
  imagemUrl?: string;
  observacao?: string;
};

export type QuoteTerms = {
  validade: string; // ex: "15 dias corridos"
  pagamento: string; // ex: "50% na aprovação e 50% na entrega"
  entrega: string;
  garantia: string;
};

export type QuoteRevision = {
  numero: number;
  motivo: string;
  data: string;
  por: string; // id do usuário
};

export type Quote = {
  id: string;
  numero: string; // ORC-2026-048
  clienteId: string;
  clienteNome: string;
  projeto: string;
  status: QuoteStatus;
  itens: QuoteItem[];
  subtotalCents: number;
  descontoPercentual: number;
  totalCents: number;
  termos: QuoteTerms;
  dataEmissao: string;
  dataValidade?: string;
  observacoes: string[];
  responsavel: string;
  parceiroIds: string[]; // ids de parceiros envolvidos
  revisaoDe?: string; // id do orçamento original se for revisão
  numeroRevisao: number; // 1 = original
  historicoRevisoes: QuoteRevision[];
  templateId?: string; // M3: template usado
  linkPublico?: string; // M4: link público interativo
  aceitoEm?: string; // M4: data/hora do aceite digital
  aceitoIp?: string; // M4: IP do aceite
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
};

export function novoQuote(
  id: string,
  numero: string,
  clienteId: string,
  clienteNome: string,
  projeto: string,
  responsavel: string,
): Quote {
  const agora = new Date().toISOString();
  const termosPadrao: QuoteTerms = {
    validade: '15 dias corridos',
    pagamento: '50% na aprovação e 50% na entrega',
    entrega: 'Conforme cronograma acordado após aprovação',
    garantia: '90 dias de suporte para correções',
  };
  return {
    id,
    numero,
    clienteId,
    clienteNome,
    projeto,
    status: 'rascunho',
    itens: [],
    subtotalCents: 0,
    descontoPercentual: 0,
    totalCents: 0,
    termos: termosPadrao,
    dataEmissao: agora,
    observacoes: [],
    responsavel,
    parceiroIds: [],
    revisaoDe: undefined,
    numeroRevisao: 1,
    historicoRevisoes: [],
    criadoEm: agora,
    atualizadoEm: agora,
    versao: 1,
  };
}

export function novoQuoteDeTemplate(
  id: string,
  numero: string,
  clienteId: string,
  clienteNome: string,
  projeto: string,
  responsavel: string,
  template: Template,
): Quote {
  const q = novoQuote(id, numero, clienteId, clienteNome, projeto, responsavel);
  q.itens = template.itens.map((i) => ({
    descricao: i.descricao,
    quantidade: 1,
    unidade: i.unidade,
    valorUnitarioCents: i.valorUnitarioCents,
    imagemUrl: i.imagemUrl,
    observacao: i.observacao,
  }));
  q.termos = template.termosPadrao;
  q.templateId = template.id;
  const total = calcularTotal(q);
  q.subtotalCents = total.subtotal;
  q.totalCents = total.total;
  return q;
}

export function calcularTotal(q: Quote): { subtotal: number; desconto: number; total: number } {
  const subtotal = q.itens.reduce((s, i) => s + i.quantidade * i.valorUnitarioCents, 0);
  const desconto = Math.round((subtotal * q.descontoPercentual) / 100);
  const total = subtotal - desconto;
  return { subtotal, desconto, total };
}

export function novoNumeroRevisao(q: Quote): string {
  return `${q.numero}-R${String(q.numeroRevisao + 1).padStart(2, '0')}`;
}

export function estaVencido(q: { dataValidade?: string }): boolean {
  if (!q.dataValidade) return false;
  const hoje = new Date().toISOString().slice(0, 10);
  return hoje > q.dataValidade;
}

export function diasParaVencimento(q: { dataValidade?: string }): number | null {
  if (!q.dataValidade) return null;
  const hoje = new Date().toISOString().slice(0, 10);
  const d1 = new Date(hoje + 'T00:00:00Z');
  const d2 = new Date(q.dataValidade + 'T00:00:00Z');
  const diff = d2.getTime() - d1.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
