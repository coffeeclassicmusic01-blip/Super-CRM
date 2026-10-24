import { FileText, Plus, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Orcamentos() {
  const MOCK_QUOTES = [
    {
      id: 'ORC-2026-0001',
      numero: 'ORC-2026-0001',
      cliente: 'Nexum Tecnologia',
      projeto: 'Redesign de plataforma digital',
      valor: 'R$ 245.000',
      status: 'em_negociacao',
      responsavel: 'Marina',
      revisao: 1,
    },
    {
      id: 'ORC-2026-0002',
      numero: 'ORC-2026-0002',
      cliente: 'Studio Forma',
      projeto: 'Identidade visual e brandbook',
      valor: 'R$ 12.800',
      status: 'enviado',
      responsavel: 'Lucas',
      revisao: 1,
    },
    {
      id: 'ORC-2026-0003',
      numero: 'ORC-2026-0003-R01',
      cliente: 'Verde & Co.',
      projeto: 'E-commerce e integração de estoque',
      valor: 'R$ 38.750',
      status: 'aprovado',
      responsavel: 'Marina',
      revisao: 2,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Orçamentos
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Criação, versionamento e acompanhamento de propostas comerciais.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={18} className="mr-2" /> Novo orçamento
        </button>
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
                Responsável
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_QUOTES.map((q) => (
              <tr key={q.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">
                  {q.numero}
                  {q.revisao > 1 && (
                    <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <GitBranch size={10} />
                      R{q.revisao}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {q.cliente}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {q.projeto}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {q.valor}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    q.status === 'aprovado'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : q.status === 'em_negociacao'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {q.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {q.responsavel}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon">
                    <FileText size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
