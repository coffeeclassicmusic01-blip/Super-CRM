import { Plus, Tag } from 'lucide-react';

export default function Parceiros() {
  const MOCK_PARTNERS = [
    {
      id: 'PAR-2026-0001',
      nome: 'Pixel Studio',
      categoria: 'Design',
      contato: 'Júlia Reis',
      email: 'julia@pixelstudio.example',
      telefone: '(11) 98800-0101',
      comissao: '10%',
      propostas: 4,
      valor: 'R$ 45.000',
    },
    {
      id: 'PAR-2026-0002',
      nome: 'CodeForge',
      categoria: 'Desenvolvimento',
      contato: 'Thiago Nunes',
      email: 'thiago@codeforge.example',
      telefone: '(11) 98800-0102',
      comissao: '15%',
      propostas: 6,
      valor: 'R$ 82.000',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Parceiros
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Cadastro de parceiros de negócios e regras de comissão.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={18} className="mr-2" /> Novo parceiro
        </button>
      </div>

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
                Comissão
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Propostas
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Valor Total
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PARTNERS.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {p.nome}
                  </span>
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
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Tag size={12} /> {p.comissao}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {p.propostas}
                </td>
                <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                  {p.valor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
