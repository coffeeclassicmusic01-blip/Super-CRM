/**
 * Entidade Pagamento (acompanhamento de pagamentos).
 * Parcelas, métodos, vencimentos, status.
 */

export type PaymentStatus = 'pendente' | 'parcial' | 'quitado' | 'atrasado' | 'cancelado';

export type PaymentMethod = 'PIX' | 'Boleto' | 'Transferência bancária' | 'Cartão' | 'Outro';

export type PaymentInstallment = {
  numero: number;
  valorCents: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: PaymentStatus;
};

export type Payment = {
  id: string;
  orcamentoId?: string;
  faturaId?: string;
  clienteId: string;
  clienteNome: string;
  metodo: PaymentMethod;
  status: PaymentStatus;
  valorTotalCents: number;
  valorPagoCents: number;
  parcelas: PaymentInstallment[];
  notas: string[];
  criadoEm: string;
  atualizadoEm: string;
};

export function novoPayment(
  id: string,
  clienteId: string,
  clienteNome: string,
  metodo: PaymentMethod,
  valorTotalCents: number,
): Payment {
  const agora = new Date().toISOString();
  return {
    id,
    clienteId,
    clienteNome,
    metodo,
    status: 'pendente',
    valorTotalCents,
    valorPagoCents: 0,
    parcelas: [],
    notas: [],
    criadoEm: agora,
    atualizadoEm: agora,
  };
}

export function valorRestante(p: Payment): number {
  return p.valorTotalCents - p.valorPagoCents;
}
