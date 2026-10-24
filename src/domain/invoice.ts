/**
 * Entidade Fatura / Espelho de Pré-Nota (Módulo 6).
 * Dados fiscais, validação CNPJ/CPF, itens, pagamentos, anexos PDF/XML.
 */
import type { PaymentMethod } from './payment';

export type InvoiceStatus = 'pendente' | 'nf_emitida' | 'cancelada';

export type InvoiceType =
  | 'venda_avulsa'
  | 'simples_remessa'
  | 'servico_instalacao'
  | 'servico_assistencia'
  | 'venda_entrega_futura';

export type ClientFiscal = {
  razaoSocial: string;
  cnpj: string;
  ie: string;
  im: string;
  regime: string;
  endereco: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  uf: string;
  cep: string;
  emailFiscal: string;
};

export type InvoiceAttachment = {
  id: string;
  nome: string;
  tamanho: number;
  tipo: string;
  dataUrl?: string;
};

export type InvoicePayment = {
  metodo: PaymentMethod;
  condicao: string;
  entradaCents: number;
  quantidadeParcelas: number;
  primeiroVencimento?: string;
  intervaloDias: number;
  notas: string;
};

export type InvoiceItem = {
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitarioCents: number;
  observacao?: string;
};

export type InvoiceActivity = {
  data: string;
  autor: string;
  acao: string;
  detalhe: string;
  status: InvoiceStatus;
};

export type Invoice = {
  id: string;
  numero: string;
  orcamentoId: string;
  orcamentoNumero: string;
  clienteId: string;
  clienteNome: string;
  tipo: InvoiceType;
  status: InvoiceStatus;
  fiscal: ClientFiscal;
  pessoa: 'PF' | 'PJ';
  contato: string;
  email: string;
  telefone: string;
  referencia: string;
  cno: string;
  solicitadoPor: string;
  emailSolicitante: string;
  dataSolicitacao: string;
  itens: InvoiceItem[];
  valorTotalCents: number;
  descontoPercentual: number;
  materiais: string[];
  frete: string;
  peso: string;
  site: { cep: string; cidade: string; uf: string; endereco: string };
  pagamento: InvoicePayment;
  requisitos: string;
  observacoes: string;
  adicionais: string;
  anexos: InvoiceAttachment[];
  emissao: {
    numeroNf?: string;
    dataEmissao?: string;
    pdf?: InvoiceAttachment;
    xml?: InvoiceAttachment;
    semXml: boolean;
  };
  historico: InvoiceActivity[];
  criadoEm: string;
  atualizadoEm: string;
};

export function novoInvoice(
  id: string,
  numero: string,
  orcamentoId: string,
  orcamentoNumero: string,
  clienteId: string,
  clienteNome: string,
): Invoice {
  const agora = new Date().toISOString();
  const fiscalVazio: ClientFiscal = {
    razaoSocial: '',
    cnpj: '',
    ie: '',
    im: '',
    regime: '',
    endereco: '',
    cidade: '',
    uf: '',
    cep: '',
    emailFiscal: '',
  };
  return {
    id,
    numero,
    orcamentoId,
    orcamentoNumero,
    clienteId,
    clienteNome,
    tipo: 'venda_avulsa',
    status: 'pendente',
    fiscal: fiscalVazio,
    pessoa: 'PJ',
    contato: '',
    email: '',
    telefone: '',
    referencia: orcamentoNumero,
    cno: '',
    solicitadoPor: '',
    emailSolicitante: '',
    dataSolicitacao: agora,
    itens: [],
    valorTotalCents: 0,
    descontoPercentual: 0,
    materiais: [],
    frete: '',
    peso: '',
    site: { cep: '', cidade: '', uf: '', endereco: '' },
    pagamento: {
      metodo: 'PIX',
      condicao: 'À vista',
      entradaCents: 0,
      quantidadeParcelas: 1,
      intervaloDias: 30,
      notas: '',
    },
    requisitos: '',
    observacoes: '',
    adicionais: '',
    anexos: [],
    emissao: { semXml: false },
    historico: [],
    criadoEm: agora,
    atualizadoEm: agora,
  };
}

export function faturarTotal(inv: Invoice): number {
  const subtotal = inv.itens.reduce((s, i) => s + i.quantidade * i.valorUnitarioCents, 0);
  const desconto = Math.round((subtotal * inv.descontoPercentual) / 100);
  return subtotal - desconto;
}
