/**
 * Lista de Parceiros de Negócios (Módulo 7: Parceiros & Comissões).
 * Tabela com busca, filtro por categoria, cards e navegação para detalhe/cadastro.
 */

import { useState } from 'react';
import { Plus, ChevronRight, Tag, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface PartnerRow {
  id: string;
  nome: string;
  nomeFantasia?: string;
  categoria: string;
  contato: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  comissao: string; // ex: "10%"
  propostas: number;
  valor: string;
  cor: string;
  iniciales: string;
}

const MOCK_PARTNERS: PartnerRow[] = [
  {
    id: 'PAR-2026-0001',
    nome: 'Pixel Studio',
    nomeFantasia: 'Pixel',
    categoria: 'Design',
    contato: 'Júlia Reis',
    email: 'julia@pixelstudio.example',
    telefone: '(11) 98800-0101',
    status: 'ativo',
    comissao: '10%',
    propostas: 4,
    valor: 'R$ 45.000',
    cor: 'violet',
    iniciales: 'PS',
  },
  {
    id: 'PAR-2026-0002',
    nome: 'CodeForge',
    nomeFantasia: undefined,
    categoria: 'Desenvolvimento',
    contato: 'Thiago Nunes',
    email: 'thiago@codeforge.example',
    telefone: '(11) 98800-0102',
    status: 'ativo',
    comissao: '15%',
    propostas: 6,
    valor: 'R$ 82.000',
    cor: 'blue',
    iniciales: 'CF',
  },
  {
    id: 'PAR-2026-0003',
    nome: 'Mídia Fluxo',
    nomeFantasia: undefined,
    categoria: 'Marketing',
    contato: 'Camila Duarte',
    email: 'camila@midiafluxo.example',
    telefone: '(11) 98800-0103',
    status: 'inativo',
    comissao: '8%',
    propostas: 2,
    valor: 'R$ 12.000',
    cor: 'amber',
    iniciales: 'MF',
  },
];

export default function Parceiros() {
  const [search, setSearch] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('todas');
  const [view, setView] = useState<'tabela' | 'cards'>('tabela');

  const categorias = ['todas', ...Array.from(new Set(MOCK_PARTNERS.map((p) => p.categoria)))];

  const filtered = MOCK_PARTNERS.filter((p) => {
    const matchSearch = `${p.nome} ${p.contato} ${p.email} ${p.categoria}`.toLowerCase().includes(search.toLowerCase());
    const matchCategoria = categoriaFilter === 'todas' || p.categoria === categoriaFilter;
    return matchSearch && matchCategoria;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Parceiros
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Cadastro de parceiros de negócios e regras de comissão (%).
          </p>
        </div>
        <Button onClick={() => window.dispatchEvent(new CustomEvent('navegar-parceiro-novo'))}>
          <Plus size={18} /> Novo parceiro
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Buscar parceiro, categoria ou contato..."
          className="w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value as any)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'todas' ? 'Todas as categorias' : cat}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          <Button
            variant={view === 'tabela' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('tabela')}
          >
            <FileText size={14} />
          </Button>
          <Button
            variant={view === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('cards')}
          >
            <Briefcase size={14} />
          </Button>
        </div>
      </div>

      {view === 'tabela' ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Parceiro
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Categoria
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
                  Comissão
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Propostas
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
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => window.dispatchEvent(new CustomEvent('navegar-parceiro-detalhe', { detail: { id: p.id } }))}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white bg-${p.cor}-500`}
                      >
                        {p.iniciales}
                      </span>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100 block">
                          {p.nome}
                        </span>
                        {p.nomeFantasia && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {p.nomeFantasia}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {p.categoria}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {p.contato}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {p.email}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {p.telefone}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.cor === 'violet' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400' :
                        p.cor === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        p.cor === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Tag size={12} /> {p.comissao}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {p.propostas}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                    {p.valor}
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
          {filtered.map((p) => (
            <article
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('navegar-parceiro-detalhe', { detail: { id: p.id } }))}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white bg-${p.cor}-500`}
                >
                  {p.iniciales}
                </span>
                <div className="flex-1">
                  <span className="font-medium text-slate-900 dark:text-slate-100 block">
                    {p.nome}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {p.categoria}
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                <p>{p.contato}</p>
                <p>{p.email}</p>
                <p>{p.telefone}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  p.cor === 'violet' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400' :
                  p.cor === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  p.cor === 'amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <Tag size={12} /> {p.comissao}
              </span>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {p.valor}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {p.propostas} proposta{p.propostas !== 1 ? 's' : ''}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}


