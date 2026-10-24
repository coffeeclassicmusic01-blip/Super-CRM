/**
 * Página Principal do Módulo Workflows (Módulo 3).
 * Integra construtor, Kanban e calendário em uma única visão.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  LayoutList,
  KanbanSquare,
  Calendar,
  ChevronRight,
  Plus,
} from 'lucide-react';

export interface WorkflowPageProps {
  workflows: any[];
  workflowInstances: any[];
  onNovoWorkflow: () => void;
  onNovoWorkflowInstance: () => void;
  onEditarWorkflow: (id: string) => void;
  onVerKanban: (workflowId: string) => void;
  onVerCalendario: (instanciaId: string) => void;
}

export function WorkflowPage({
  workflows,
  workflowInstances,
  onNovoWorkflow,
  onNovoWorkflowInstance,
  onEditarWorkflow,
  onVerKanban,
  onVerCalendario,
}: WorkflowPageProps) {
  const [abaAtiva, setAbaAtiva] = useState<'workflows' | 'instances'>('workflows');

  const abas = [
    { id: 'workflows' as const, label: 'Workflows', icon: LayoutList },
    { id: 'instances' as const, label: 'Instâncias', icon: KanbanSquare },
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Construtor de Fluxos
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Workflows personalizados com etapas, Kanban e agendamento de equipes externas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onNovoWorkflow}>
            <Plus size={18} /> Novo workflow
          </Button>
          <Button onClick={onNovoWorkflowInstance}>
            <KanbanSquare size={18} /> Nova instância
          </Button>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-4">
        {abas.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              abaAtiva === aba.id
                ? 'border-primary text-primary'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 border-transparent'
            }`}
          >
            <aba.icon size={16} />
            {aba.label}
          </button>
        ))}
      </div>

      {abaAtiva === 'workflows' ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Workflow
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Categoria
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Etapas
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((w) => (
                <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{w.nome}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{w.categoria}</td>
                  <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">{w.etapas?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      w.status === 'ativo'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEditarWorkflow(w.id)}>
                      <ChevronRight size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Instância
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Workflow
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Cliente / Projeto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Responsável
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {workflowInstances.map((inst) => (
                <tr key={inst.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">{inst.id}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{inst.workflowNome}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-900 dark:text-slate-100 block">{inst.clienteNome || '—'}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{inst.projetoId || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      inst.status === 'em_andamento'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        : inst.status === 'concluido'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : inst.status === 'pausado'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{inst.responsavel}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onVerKanban(inst.workflowId)}>
                        <KanbanSquare size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onVerCalendario(inst.id)}>
                        <Calendar size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Próximos passos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Crie workflows, defina etapas e acompanhe o progresso em Kanban.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <ChevronRight size={14} /> Ver documentação
          </Button>
        </div>
      </div>
    </div>
  );
}
