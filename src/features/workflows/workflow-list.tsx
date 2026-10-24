/**
 * Lista de Workflows (Módulo 3: Construtor de Fluxos Personalizados & Etapas).
 * Exibe workflows cadastrados com contagem de etapas e status.
 */

import { useState } from 'react';
import { Plus, LayoutList, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface WorkflowRow {
  id: string;
  nome: string;
  categoria: string;
  descricao?: string;
  status: 'ativo' | 'inativo' | 'arquivado';
  etapas: number;
  criadoEm: string;
}

const MOCK_WORKFLOWS: WorkflowRow[] = [
  {
    id: 'WKF-2026-0001',
    nome: 'Instalação de Sistema',
    categoria: 'Instalação',
    descricao: 'Fluxo padrão para instalação de sistemas em clientes.',
    status: 'ativo',
    etapas: 3,
    criadoEm: '2026-10-01T00:00:00Z',
  },
  {
    id: 'WKF-2026-0002',
    nome: 'Venda de Projeto',
    categoria: 'Venda',
    descricao: 'Fluxo comercial padrão para fechamento de vendas.',
    status: 'ativo',
    etapas: 3,
    criadoEm: '2026-10-01T00:00:00Z',
  },
  {
    id: 'WKF-2026-0003',
    nome: 'Suporte Técnico',
    categoria: 'Suporte',
    descricao: 'Fluxo de atendimento de chamados de suporte.',
    status: 'ativo',
    etapas: 3,
    criadoEm: '2026-10-01T00:00:00Z',
  },
];

export default function WorkflowList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const filtered = MOCK_WORKFLOWS.filter((w) => {
    const matchSearch = `${w.nome} ${w.descricao} ${w.categoria}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'todos' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusConfig: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    ativo: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'bg-emerald-900/20', darkText: 'text-emerald-400' },
    inativo: { bg: 'bg-slate-100', text: 'text-slate-700', darkBg: 'bg-slate-700/20', darkText: 'text-slate-300' },
    arquivado: { bg: 'bg-slate-100', text: 'text-slate-700', darkBg: 'bg-slate-700/20', darkText: 'text-slate-400' },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Workflows
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Construtor de fluxos personalizados com etapas, Kanban e responsáveis.
          </p>
        </div>
        <Button onClick={() => window.dispatchEvent(new CustomEvent('navegar-workflow-novo'))}>
          <Plus size={18} /> Novo workflow
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar workflow, categoria ou descrição..."
          className="w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="arquivado">Arquivado</option>
        </select>
      </div>

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
                Descrição
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Etapas
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Criado em
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr
                key={w.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900 dark:text-slate-100 block">
                    {w.nome}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {w.id}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {w.categoria}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {w.descricao || '—'}
                </td>
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">
                  {w.etapas}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[w.status].bg} ${statusConfig[w.status].text} ${statusConfig[w.status].darkBg} ${statusConfig[w.status].darkText}`}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {w.criadoEm.slice(0, 10)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <LayoutList size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Check size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <LayoutList size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum workflow encontrado.</p>
        </div>
      )}
    </div>
  );
}
