/**
 * Entidade Parceiro de Negócios (Módulo 7: Parceiros & Comissões).
 * Cadastro de parceiros com regras de comissão (%) e extrato de participação.
 */

export type PartnerCategory =
  | 'Design'
  | 'Desenvolvimento'
  | 'Marketing'
  | 'Consultoria'
  | 'Gráfica'
  | 'Instalação'
  | 'Suporte'
  | 'Outro';

export type PartnerStatus = 'ativo' | 'inativo';

export type CommissionRule = {
  tipo: 'percentual' | 'fixo';
  valor: number; // % se percentual, valor fixo em centavos se fixo
  aplicaSobre: 'valorTotal' | 'lucro' | 'primeiraParcela';
};

export type Partner = {
  id: string;
  nome: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  categoria: PartnerCategory;
  status: PartnerStatus;
  contato?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  regrasComissao: CommissionRule[];
  comissaoAcumuladaCents: number;
  comissaoAPagarCents: number;
  notas: string[];
  cor: string;
  iniciales: string;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
};

export function novoPartner(
  id: string,
  nome: string,
  cpfCnpj: string,
  categoria: PartnerCategory,
): Partner {
  const agora = new Date().toISOString();
  return {
    id,
    nome,
    cpfCnpj,
    categoria,
    status: 'ativo',
    regrasComissao: [],
    comissaoAcumuladaCents: 0,
    comissaoAPagarCents: 0,
    notas: [],
    cor: 'slate',
    iniciales: nome
      .split(' ')
      .map((p) => p[0]?.toUpperCase())
      .filter(Boolean)
      .join(''),
    criadoEm: agora,
    atualizadoEm: agora,
    versao: 1,
  };
}

export function parceiroDisplayName(p: Partner): string {
  return p.nomeFantasia ? `${p.nome} (${p.nomeFantasia})` : p.nome;
}
