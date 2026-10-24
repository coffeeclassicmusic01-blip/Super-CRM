/**
 * Entidade Projeto (Módulo 3: Construtor de Fluxos Personalizados & Etapas).
 * Acompanhamento de projetos com workflow personalizado, Kanban, prazos.
 */

export type ProjectStatus =
  | 'planejamento'
  | 'em_andamento'
  | 'pausado'
  | 'concluido'
  | 'cancelado';

export type ProjectStage = {
  id: string;
  nome: string;
  categoria: string;
  responsavel: string;
  anexosObrigatorios: string[]; // tipos de anexo exigidos
  prazoDias: number;
  ordem: number;
  concluido: boolean;
  dataConclusao?: string;
};

export type Project = {
  id: string;
  nome: string;
  clienteId: string;
  clienteNome: string;
  orcamentoId?: string; // orçamento vinculado
  status: ProjectStatus;
  descricao?: string;
  etapas: ProjectStage[];
  etapaAtualId?: string;
  responsavel: string;
  dataInicio: string;
  dataPrevistaTermino?: string;
  dataTerminoReal?: string;
  calendarioVisitas: string[]; // ids de eventos de visita/medição/instalação
  notas: string[];
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
};

export function novoProject(
  id: string,
  nome: string,
  clienteId: string,
  clienteNome: string,
  responsavel: string,
): Project {
  const agora = new Date().toISOString();
  return {
    id,
    nome,
    clienteId,
    clienteNome,
    status: 'planejamento',
    etapas: [],
    responsavel,
    dataInicio: agora,
    calendarioVisitas: [],
    notas: [],
    criadoEm: agora,
    atualizadoEm: agora,
    versao: 1,
  };
}

export function proximaEtapa(p: Project): ProjectStage | undefined {
  const pendentes = p.etapas.filter((e) => !e.concluido).sort((a, b) => a.ordem - b.ordem);
  return pendentes[0];
}

export function progressoPercentual(p: Project): number {
  if (p.etapas.length === 0) return 0;
  const concluídas = p.etapas.filter((e) => e.concluido).length;
  return Math.round((concluídas / p.etapas.length) * 100);
}
