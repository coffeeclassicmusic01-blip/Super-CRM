/**
 * Página de Comunicação Interna (Módulo 9: Comunicação Interna - Estilo Teams).
 * Integra lista de canais, mensagens, status de usuário e mural de comentários.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';
import { ChannelList } from './channel-list';
import { MessageList } from './message-list';
import { UserStatus } from './user-status';
import { type User, MOCK_USERS } from './chat-types';

export interface CommunicationsInternalProps {
  usuarioId: string;
  onVoltar: () => void;
}

export function CommunicationsInternal({ usuarioId, onVoltar }: CommunicationsInternalProps) {
  const [canalSelecionado, setCanalSelecionado] = useState<string | null>('CH-001');
  const [usuarioAtual] = useState<User>(MOCK_USERS[0]); // Marina Costa por padrão

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
              CS
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Comunicação Interna
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Canais, mensagens diretas e colaboração em tempo real
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onVoltar}>
              <MessageSquare size={16} /> Voltar ao CRM
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                {usuarioAtual.nome}
              </span>
              <UserStatus usuario={usuarioAtual} tamanho="pequeno" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar - Canais */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <ChannelList
            usuarioAtualId={usuarioId}
            onSelecionarCanal={setCanalSelecionado}
          />
        </div>

        {/* Main - Mensagens */}
        <div className="flex-1 flex flex-col min-w-0">
          {canalSelecionado ? (
            <MessageList
              canalId={canalSelecionado}
              usuarioAtualId={usuarioId}
              onEnviar={(texto, mencoes, referencias) => {
                console.log('Nova mensagem:', { texto, mencoes, referencias });
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
              <MessageSquare size={48} className="mb-4 opacity-30" />
              <p>Selecione um canal para iniciar a conversa.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mural de Comentários - Painel lateral */}
      <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                Mural de Comentários
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              3 comentários
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Comentários vinculados a este pedido/orçamento.
          </p>
          <div className="space-y-3">
            <div className="flex gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/30">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-400">
                MC
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  A proposta <span className="text-amber-600 dark:text-amber-400 font-mono">#ORC-2026-0001</span> precisa de revisão no escopo.
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Marina Costa • 10 out
                </p>
              </div>
            </div>
            <div className="flex gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/30">
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-[10px] font-bold text-amber-700 dark:text-amber-400">
                LS
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  Cliente aprovou a etapa de <span className="text-primary font-medium">medição</span>.
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Lucas Silva • 09 out
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
