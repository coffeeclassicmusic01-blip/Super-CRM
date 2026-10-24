/**
 * Lista de Orçamentos com Versionamento (Módulo 4: Orçamentos, Revisões & Espelho de Pré-Nota).
 * Exibe orçamentos com histórico de revisões, status, validade e alertas de vencimento.
 */

import { useState } from 'react';
import { GitBranch, Clock, Plus, AlertTriangle, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatMoneyBRL } from '@/core/money';
import { formatDateBR } from '@/core/date';
import { estaVencido, diasParaVencimento } from '@/domain/quote';

export interface QuoteRow {
  id: string;
  numero: string;
  clienteNome: string;
  projeto: string;
  valor: number;
  status: 'rascunho' | 'enviado' | 'em_negociacao' | 'aprovado' | 'perdido' | 'cancelado';
  responsavel: string;
  dataEmissao: string;
  dataValidade?: string;
  numeroRevisao: number;
  revisaoDe?: string;
  linkPublico?: string;
  aceitoEm?: string;
}

export interface QuoteListProps {
  orcamentos: QuoteRow[];
  onNovo: () => void;
  onEditar?: (id: string) => void;
  onDetalhe: (id: string) => void;
  onNovaRevisao?: (id: string, motivo: string) => void;
  onGerarLink: (id: string) => void;
}

export function QuoteList({
  orcamentos,
  onNovo,
  onEditar,
  onDetalhe,
  onNovaRevisao,
  onGerarLink,
}: QuoteListProps) {
  const _onEditar = onEditar;
  const _onNovaRevisao = onNovaRevisao;
  void _onEditar;
  void _onNovaRevisao;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const statuses = [
    { value: 'todos', label: 'Todos os status' },
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'em_negociacao', label: 'Em negociação' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'perdido', label: 'Perdido' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  const filtered = orcamentos.filter((o) => {
    const matchSearch = `${o.numero} ${o.clienteNome} ${o.projeto}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'todos' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusConfig: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    rascunho: { bg: 'bg-slate-100', text: 'text-slate-700', darkBg: 'bg-slate-700/20', darkText: 'text-slate-300' },
    enviado: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'bg-blue-900/20', darkText: 'text-blue-400' },
    em_negociacao: { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'bg-amber-900/20', darkText: 'text-amber-400' },
    aprovado: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'bg-emerald-900/20', darkText: 'text-emerald-400' },
    perdido: { bg: 'bg-red-100', text: 'text-red-700', darkBg: 'bg-red-900/20', darkText: 'text-red-400' },
    cancelado: { bg: 'bg-slate-100', text: 'text-slate-700', darkBg: 'bg-slate-700/20', darkText: 'text-slate-400' },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Orçamentos
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Versionamento de orçamentos (v1, v2, v3) com log de motivos e alertas de vencimento.
          </p>
        </div>
        <Button onClick={onNovo}>
          <Plus size={18} /> Novo orçamento
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar orçamento, cliente ou projeto..."
          className="w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{filtered.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Valor total</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {formatMoneyBRL({ cents: filtered.reduce((s, o) => s + o.valor, 0) * 100 })}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Aprovados</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {filtered.filter((o) => o.status === 'aprovado').length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Vencendo</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {filtered.filter((o) => {
              const d = diasParaVencimento(o);
              return d !== null && d > 0 && d <= 7;
            }).length}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Nº Orçamento
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Cliente / Projeto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Validade
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Revisões
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const vencido = estaVencido(o);
              const dias = diasParaVencimento(o);
              const cfg = statusConfig[o.status];
              const isRev = o.numeroRevisao > 1;
              return (
                <tr
                  key={o.id}
                  className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${vencido ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                >
                  <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">
                    {o.numero}
                    {isRev && (
                      <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <GitBranch size={10} /> R{o.numeroRevisao}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium text-slate-900 dark:text-slate-100 block">
                        {o.clienteNome}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {o.projeto}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatMoneyBRL({ cents: o.valor * 100 })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.darkBg} ${cfg.darkText}`}
                    >
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {o.dataValidade ? (
                      <span
                        className={`text-xs font-medium ${
                          vencido ? 'text-red-600 dark:text-red-400' :
                          (dias !== null && dias <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400')
                        }`}
                        title={vencido ? 'Vencido' : dias !== null ? `Vence em ${dias} dia(s)` : ''}
                      >
                        {formatDateBR(o.dataValidade)}
                        {vencido && (
                          <AlertTriangle size={12} className="ml-1" />
                        )}
                        {dias !== null && !vencido && dias <= 7 && (
                          <Clock size={12} className="ml-1" />
                        )}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {o.numeroRevisao}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); onDetalhe(o.id); }}
                      >
                        <FileText size={16} />
                      </Button>
                      {o.linkPublico ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onGerarLink(o.id); }}
                        >
                          <Check size={16} />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); onGerarLink(o.id); }}
                        >
                          <Plus size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum orçamento encontrado.</p>
        </div>
      )}
    </div>
  );
}


