import { FileText, Users, Briefcase, Receipt, CreditCard } from 'lucide-react';

export default function Dashboard() {
  const cards = [
    {
      title: 'Clientes',
      value: '124',
      subtitle: 'Cadastros ativos',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Parceiros',
      value: '18',
      subtitle: 'Rede de negócios',
      icon: Briefcase,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Orçamentos',
      value: 'R$ 482.000',
      subtitle: 'Valor total em propostas',
      icon: FileText,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      title: 'Faturamento',
      value: 'R$ 210.000',
      subtitle: 'Pré-notas fiscais',
      icon: Receipt,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Visão geral
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Acompanhe clientes, orçamentos, projetos e pagamentos em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.title} className={`rounded-xl p-5 border border-slate-200 dark:border-slate-800 ${card.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon size={20} className={card.color} />
              </div>
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              {card.title}
            </h3>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {card.value}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Ações rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="btn-outline">
            <FileText size={20} className="mr-2" /> Novo orçamento
          </button>
          <button className="btn-outline">
            <Users size={20} className="mr-2" /> Novo cliente
          </button>
          <button className="btn-outline">
            <Briefcase size={20} className="mr-2" /> Novo parceiro
          </button>
          <button className="btn-outline">
            <CreditCard size={20} className="mr-2" /> Novo projeto
          </button>
        </div>
      </div>
    </div>
  );
}
