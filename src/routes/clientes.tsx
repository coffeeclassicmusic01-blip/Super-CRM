/**
 * Página de Listagem de Clientes (Módulo 5).
 * Tabela com busca, cards, kanban e navegação para detalhe/cadastro.
 */

import { useState } from 'react';
import { Plus, FileText, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ClientRow {
  id: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  contato: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo' | 'prospecto' | 'bloqueado';
  orcamentos: number;
  valorTotal: string;
  cor: string;
  iniciales: string;
}

const MOCK_CLIENTS: ClientRow[] = [
  {
    id: 'CLI-2026-0001',
    nome: 'Nexum Tecnologia',
    tipo: 'PJ',
    contato: 'Rafael Oliveira',
    email: 'rafael@nexum.example',
    telefone: '(11) 99000-1048',
    status: 'ativo',
    orcamentos: 3,
    valorTotal: 'R$ 245.000',
    cor: 'teal',
    iniciales: 'NX',
  },
  {
    id: 'CLI-2026-0002',
    nome: 'Studio Forma',
    tipo: 'PJ',
    contato: 'Beatriz Costa',
    email: 'beatriz@forma.example',
    telefone: '(11) 99000-1047',
    status: 'ativo',
    orcamentos: 2,
    valorTotal: 'R$ 12.800',
    cor: 'violet',
    iniciales: 'SF',
  },
  {
    id: 'CLI-2026-0003',
    nome: 'Verde & Co.',
    tipo: 'PJ',
    contato: 'Ana Martins',
    email: 'ana@verde.example',
    telefone: '(11) 99000-1046',
    status: 'ativo',
    orcamentos: 1,
    valorTotal: 'R$ 38.750',
    cor: 'green',
    iniciales: 'VC',
  },
];

export default function Clientes() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'tabela' | 'cards'>('tabela');

  const filtered = MOCK_CLIENTS.filter((c) =>
    `${c.nome} ${c.contato} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Clientes
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestão de cadastro de clientes (PF/PJ), contatos e endereços.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.dispatchEvent(new CustomEvent('navegar-cliente-novo'))}>
            <Plus size={18} className="mr-2" /> Novo cliente
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Buscar cliente, contato ou e-mail..."
          className="w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1">
          <Button variant={view === 'tabela' ? 'default' : 'outline'} size="sm" onClick={() => setView('tabela')}>
            <FileText size={14} />
          </Button>
          <Button variant={view === 'cards' ? 'default' : 'outline'} size="sm" onClick={() => setView('cards')}>
            <Users size={14} />
          </Button>
        </div>
      </div>

      {view === 'tabela' ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Contato
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Orçamentos
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Valor Total
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => window.dispatchEvent(new CustomEvent('navegar-cliente-detalhe', { detail: { id: c.id } }))}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white bg-${c.cor}-500`}
                      >
                        {c.iniciales}
                      </span>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100 block">
                          {c.nome}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {c.tipo === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {c.tipo}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {c.contato}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {c.email}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {c.telefone}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.status === 'ativo'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : c.status === 'prospecto'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : c.status === 'inativo'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {c.orcamentos}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {c.valorTotal}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); }}>
                      <ChevronRight size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('navegar-cliente-detalhe', { detail: { id: c.id } }))}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white bg-${c.cor}-500`}
                >
                  {c.iniciales}
                </span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900 dark:text-slate-100 block">
                    {c.nome}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {c.tipo === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                <p>{c.contato}</p>
                <p>{c.email}</p>
                <p>{c.telefone}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  c.status === 'ativo'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : c.status === 'prospecto'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : c.status === 'inativo'
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}
              >
                {c.status}
              </span>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {c.valorTotal}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {c.orcamentos} orçamento{c.orcamentos !== 1 ? 's' : ''}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
