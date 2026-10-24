/**
 * Entidade Template de Proposta (Módulo 2: Gerador de Propostas, Simuladores & Layouts).
 * Templates reutilizáveis por tipo de serviço/produto.
 */

export type TemplateCategory =
  | 'servico'
  | 'produto'
  | 'projeto'
  | 'consultoria'
  | 'instalacao'
  | 'manutencao';

export type TemplateItem = {
  descricao: string;
  unidade: string; // UN, M, M², M³, KG, L, CX, RL, PC
  valorUnitarioCents: number;
  imagemUrl?: string;
  observacao?: string;
  opcional: boolean;
};

export type Template = {
  id: string;
  nome: string;
  categoria: TemplateCategory;
  descricao?: string;
  itens: TemplateItem[];
  termosPadrao: {
    validade: string;
    pagamento: string;
    entrega: string;
    garantia: string;
  };
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export function novoTemplate(
  id: string,
  nome: string,
  categoria: TemplateCategory,
): Template {
  const agora = new Date().toISOString();
  return {
    id,
    nome,
    categoria,
    itens: [],
    termosPadrao: {
      validade: '15 dias corridos',
      pagamento: '50% na aprovação e 50% na entrega',
      entrega: 'Conforme cronograma acordado após aprovação',
      garantia: '90 dias de suporte para correções',
    },
    ativo: true,
    criadoEm: agora,
    atualizadoEm: agora,
  };
}

export function calcularSubtotal(template: Template): number {
  return template.itens.reduce(
    (s, i) => s + i.valorUnitarioCents,
    0,
  );
}
