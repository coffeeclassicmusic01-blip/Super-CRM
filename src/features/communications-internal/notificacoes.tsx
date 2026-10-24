/**
 * Notificações e Menções (Módulo 9: Comunicação Interna).
 * Lista de notificações com @usuário e #pedido.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Clock } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from './chat-types';

export interface NotificacoesProps {
  usuarioId: string;
  onMarcarLida: (id: string) => void;
}

export function Notificacoes({ usuarioId, onMarcarLida }: NotificacoesProps) {
  const [abertas, setAbertas] = useState(false);
  const notificacoes = MOCK_NOTIFICATIONS.filter((n) => n.usuarioId === usuarioId);
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAbertas((a) => !a)}
        className="flex items-center gap-2 relative"
      >
        <Bell size={18} className={naoLidas > 0 ? 'text-primary' : 'text-slate-500 dark:text-slate-400'} />
        {naoLidas > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500" />
        )}
        <span className="text-xs font-medium">
          Notificações{naoLidas > 0 ? ` (${naoLidas})` : ''}
        </span>
      </Button>

      {abertas && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg z-50">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
              Notificações
            </h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notificacoes.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                Nenhuma notificação.
              </div>
            ) : (
              notificacoes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onMarcarLida(n.id)}
                  className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                        n.tipo === 'mençao'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                          : n.tipo === 'pedido'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : n.tipo === 'resposta'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {n.tipo === 'mençao' && <span className="text-amber-600 dark:text-amber-400">@</span>}
                      {n.tipo === 'pedido' && <span className="text-blue-600 dark:text-blue-400">#</span>}
                      {n.tipo === 'resposta' && <Clock size={10} />}
                      {n.tipo === 'sistema' && <span className="text-slate-600 dark:text-slate-400">👥</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
                        {n.texto}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {new Date(n.criadoEm).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    {!n.lida && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
              Marcar todas como lidas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
