/**
 * Entidades de Workflow (Módulo 3: Construtor de Fluxos Personalizados & Etapas).
 * Workflows com etapas ilimitadas, responsáveis, anexos obrigatórios, prazos e Kanban.
 */

export type WorkflowCategory =
  | 'venda'
  | 'instalacao'
  | 'medicao'
  | 'suporte'
  | 'projeto'
  | 'outro';

export type WorkflowStatus = 'ativo' | 'inativo' | 'arquivado';

export type WorkflowStage = {
  id: string;
  nome: string;
  categoria: string;
  responsavel: string;
  anexosObrigatorios: string[]; // tipos de anexo exigidos (ex: 'contrato', 'comprovante')
  prazoDias: number;
  ordem: number;
  concluido: boolean;
  cor: string;
};

export type Workflow = {
  id: string;
  nome: string;
  categoria: WorkflowCategory;
  descricao?: string;
  status: WorkflowStatus;
  etapas: WorkflowStage[];
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
};

export type WorkflowInstance = {
  id: string;
  workflowId: string;
  workflowNome: string;
  projetoId?: string;
  clienteId?: string;
  clienteNome?: string;
  status: 'planejamento' | 'em_andamento' | 'pausado' | 'concluido' | 'cancelado';
  etapaAtualId?: string;
  responsavel: string;
  dataInicio: string;
  dataPrevistaTermino?: string;
  dataTerminoReal?: string;
  calendarioEventos: CalendarEvent[]; // visitas, medições, instalações
  notas: string[];
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
};

export type CalendarEvent = {
  id: string;
  tipo: 'visita' | 'medicao' | 'instalacao';
  titulo: string;
  descricao?: string;
  dataInicio: string; // ISO
  dataFim: string; // ISO
  responsavel: string;
  local?: string;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  anexos: string[]; // URLs ou IDs de anexos
};

export function novoWorkflow(
  id: string,
  nome: string,
  categoria: WorkflowCategory,
): Workflow {
  const agora = new Date().toISOString();
  return {
    id,
    nome,
    categoria,
    status: 'ativo',
    etapas: [],
    criadoEm: agora,
    atualizadoEm: agora,
    versao: 1,
  };
}

export function novoWorkflowStage(
  id: string,
  nome: string,
  categoria: string,
  responsavel: string,
  prazoDias: number,
  ordem: number,
): WorkflowStage {
  return {
    id,
    nome,
    categoria,
    responsavel,
    anexosObrigatorios: [],
    prazoDias,
    ordem,
    concluido: false,
    cor: 'slate',
  };
}

export function novoWorkflowInstance(
  id: string,
  workflowId: string,
  workflowNome: string,
  responsavel: string,
): WorkflowInstance {
  const agora = new Date().toISOString();
  const instance: WorkflowInstance = {
    id,
    workflowId,
    workflowNome,
    status: 'planejamento',
    responsavel,
    dataInicio: agora,
    calendarioEventos: [],
    notas: [],
    criadoEm: agora,
    atualizadoEm: agora,
    versao: 1,
  };
  return instance;
}

export function proximaEtapa(_instance: WorkflowInstance, workflow: Workflow): WorkflowStage | undefined {
  const pendentes = workflow.etapas
    .filter((e) => !e.concluido)
    .sort((a, b) => a.ordem - b.ordem);
  return pendentes[0];
}

export function progressoPercentual(workflow: Workflow): number {
  if (workflow.etapas.length === 0) return 0;
  const concluídas = workflow.etapas.filter((e) => e.concluido).length;
  return Math.round((concluídas / workflow.etapas.length) * 100);
}

export function eventosPorData(eventos: CalendarEvent[], data: string): CalendarEvent[] {
  return eventos.filter((e) => e.dataInicio.slice(0, 10) === data);
}
