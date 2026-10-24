import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Faturamento() {
  const MOCK_INVOICES = [
    {
      id: 'NF-2026-0001',
      numero: 'NF-2026-0001',
      orcamento: 'ORC-2026-0003',
      cliente: 'Verde & Co.',
      valor: 'R$ 38.750',
      status: 'pendente',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Faturamento
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Espelho de pré-nota fiscal e controle de faturamento.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={18} className="mr-2" /> Nova pré-nota
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Nº Nota Fiscal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Orçamento
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                Valor
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
            {MOCK_INVOICES.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">
                  {inv.numero}
                </td>
                <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                  {inv.orcamento}
                </td>
                <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                  {inv.cliente}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {inv.valor}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 text-xs font-semibold">
                    {inv.status}
                  </span>
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
