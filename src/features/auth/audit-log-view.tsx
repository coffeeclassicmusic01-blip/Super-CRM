/**
 * Tela de Auditoria (Audit Log - Módulo 9).
 */

export function AuditLogView(): React.ReactNode {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Histórico de Auditoria
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Registre todas as alterações feitas no sistema para rastreabilidade.
          </p>
        </div>
      </div>
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p>Módulo de Auditoria em implementação.</p>
      </div>
    </div>
  );
}
