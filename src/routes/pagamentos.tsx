import { CreditCard } from 'lucide-react';

export default function Pagamentos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Pagamentos
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Acompanhamento de pagamentos, parcelas e vencimentos.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <CreditCard size={20} />
          <span>Módulo de pagamentos em construção.</span>
        </div>
      </div>
    </div>
  );
}
