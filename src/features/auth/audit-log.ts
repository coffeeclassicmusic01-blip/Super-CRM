/**
 * Histórico de Auditoria (Audit Log - Módulo 9).
 * Registra todas as alterações feitas no sistema para rastreabilidade.
 */

export type AcaoAuditoria =
  | 'criar'
  | 'atualizar'
  | 'excluir'
  | 'aprovar'
  | 'login'
  | 'logout'
  | 'enviar_proposta'
  | 'alterar_status'
  | 'criar_revisao';

export type LogAuditoria = {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  modulo: string;
  acao: AcaoAuditoria;
  registroId: string;
  registroNome: string;
  valoresAnteriores?: Record<string, unknown>;
  valoresNovos?: Record<string, unknown>;
  dataHora: string;
  ip?: string;
};

export type LogAuditoriaFiltro = {
  modulo?: string;
  usuarioId?: string;
  acao?: AcaoAuditoria;
  dataInicio?: string;
  dataFim?: string;
};

export const MOCK_AUDIT_LOG: LogAuditoria[] = [
  {
    id: 'LOG-001',
    usuarioId: 'USR-001',
    usuarioNome: 'Marina Costa',
    modulo: 'orcamentos',
    acao: 'criar',
    registroId: 'ORC-2026-0001',
    registroNome: 'ORC-2026-0001 - Redesign de plataforma digital',
    valoresAnteriores: undefined,
    valoresNovos: { status: 'rascunho', totalCents: 2450000 },
    dataHora: '2026-10-09T09:00:00Z',
    ip: '192.168.1.50',
  },
  {
    id: 'LOG-002',
    usuarioId: 'USR-001',
    usuarioNome: 'Marina Costa',
    modulo: 'orcamentos',
    acao: 'alterar_status',
    registroId: 'ORC-2026-0001',
    registroNome: 'ORC-2026-0001 - Redesign de plataforma digital',
    valoresAnteriores: { status: 'rascunho' },
    valoresNovos: { status: 'em_negociacao' },
    dataHora: '2026-10-09T10:30:00Z',
    ip: '192.168.1.50',
  },
  {
    id: 'LOG-003',
    usuarioId: 'USR-002',
    usuarioNome: 'Lucas Silva',
    modulo: 'clientes',
    acao: 'criar',
    registroId: 'CLI-2026-0002',
    registroNome: 'Studio Forma',
    valoresAnteriores: undefined,
    valoresNovos: { nome: 'Studio Forma', tipo: 'PJ' },
    dataHora: '2026-10-08T14:15:00Z',
    ip: '192.168.1.51',
  },
  {
    id: 'LOG-004',
    usuarioId: 'USR-001',
    usuarioNome: 'Marina Costa',
    modulo: 'faturamento',
    acao: 'aprovar',
    registroId: 'NF-2026-0001',
    registroNome: 'NF-2026-0001 - Verde & Co.',
    valoresAnteriores: { status: 'pendente' },
    valoresNovos: { status: 'nf_emitida', numeroNf: 'NF-e 12345' },
    dataHora: '2026-10-09T16:00:00Z',
    ip: '192.168.1.50',
  },
  {
    id: 'LOG-005',
    usuarioId: 'USR-003',
    usuarioNome: 'Pedro Alves',
    modulo: 'projetos',
    acao: 'atualizar',
    registroId: 'PROJ-2026-0001',
    registroNome: 'Redesign Nexum',
    valoresAnteriores: { status: 'planejamento' },
    valoresNovos: { status: 'em_andamento', progresso: 20 },
    dataHora: '2026-10-05T11:00:00Z',
    ip: '192.168.1.52',
  },
];

export function filtrarLogs(
  logs: LogAuditoria[],
  filtro: LogAuditoriaFiltro,
): LogAuditoria[] {
  return logs.filter((log) => {
    if (filtro.modulo && log.modulo !== filtro.modulo) return false;
    if (filtro.usuarioId && log.usuarioId !== filtro.usuarioId) return false;
    if (filtro.acao && log.acao !== filtro.acao) return false;
    if (filtro.dataInicio && log.dataHora < filtro.dataInicio) return false;
    if (filtro.dataFim && log.dataHora > filtro.dataFim) return false;
    return true;
  });
}

export const acaoLabels: Record<AcaoAuditoria, string> = {
  criar: 'Criar',
  atualizar: 'Atualizar',
  excluir: 'Excluir',
  aprovar: 'Aprovar',
  login: 'Login',
  logout: 'Logout',
  enviar_proposta: 'Enviar Proposta',
  alterar_status: 'Alterar Status',
  criar_revisao: 'Criar Revisão',
};

export const acaoCores: Record<AcaoAuditoria, string> = {
  criar: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  atualizar: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  excluir: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
  aprovar: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  login: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  logout: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  enviar_proposta: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  alterar_status: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  criar_revisao: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
};
