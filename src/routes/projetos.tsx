import { Plus } from 'lucide-react';

export default function Projetos() {
  const MOCK_PROJECTS = [
    {
      id: 'PROJ-2026-0001',
      nome: 'Redesign Nexum',
      cliente: 'Nexum Tecnologia',
      status: 'em_andamento',
      responsavel: 'Marina',
      progresso: 65,
    },
    {
      id: 'PROJ-2026-0002',
      nome: 'E-commerce Verde & Co.',
      cliente: 'Verde & Co.',
      status: 'planejamento',
      responsavel: 'Lucas',
      progresso: 20,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Projetos
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Acompanhamento de projetos com workflows personalizados e Kanban.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={18} className="mr-2" /> Novo projeto
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Projeto
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Responsável
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                Progresso
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PROJECTS.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {p.nome}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {p.cliente}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p.status === 'em_andamento'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {p.responsavel}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${p.progresso}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {p.progresso}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
