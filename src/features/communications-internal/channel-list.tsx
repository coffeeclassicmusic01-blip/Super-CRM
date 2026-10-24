/**
 * Lista de Canais (Módulo 9: Comunicação Interna).
 * Exibe canais por setor/projeto e mensagens diretas.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserStatus } from './user-status';
import {
  getUserById,
  MOCK_CHANNELS,
} from './chat-types';
import { MessageSquare, Clock } from 'lucide-react';

export interface ChannelListProps {
  usuarioAtualId: string;
  onSelecionarCanal: (canalId: string) => void;
}

export function ChannelList({ usuarioAtualId, onSelecionarCanal }: ChannelListProps) {
  const [search, setSearch] = useState('');
  const [canalSelecionado, setCanalSelecionado] = useState<string | null>(null);

  const canaisFiltrados = MOCK_CHANNELS.filter((c) => {
    const matchSearch = `${c.nome} ${c.descricao}`.toLowerCase().includes(search.toLowerCase());
    const ehMembro = c.membros.includes(usuarioAtualId);
    return matchSearch && ehMembro;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={18} className="text-primary" />
          <span className="font-semibold text-slate-900 dark:text-slate-50">
            Comunicação
          </span>
        </div>
        <Input
          placeholder="Buscar canais..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {canaisFiltrados.map((canal) => {
          const ehCanal = canal.tipo === 'canal';
          const outrosMembros = canal.membros.filter((m) => m !== usuarioAtualId);
          const membro = outrosMembros.length > 0 ? getUserById(outrosMembros[0]) : null;

          return (
            <button
              key={canal.id}
              onClick={() => {
                setCanalSelecionado(canal.id);
                onSelecionarCanal(canal.id);
              }}
              className={`flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                canalSelecionado === canal.id
                  ? 'bg-primary/10 text-primary border border-primary/50'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  ehCanal
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {canal.nome.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {canal.nome}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {canal.descricao || (membro ? membro.nome : '')}
                </span>
              </div>
              {ehCanal && (
                <span className="text-slate-400" title={`${canal.membros.length} membros`}>
                  {canal.membros.length}
                </span>
              )}
              {!ehCanal && membro && (
                <UserStatus usuario={membro} tamanho="pequeno" />
              )}
              {ehCanal && (
                <span className="text-slate-400" title={`${canal.membros.length} membros`}>
                  {canal.membros.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            const novoCanal = `CH-${Date.now()}`;
            onSelecionarCanal(novoCanal);
          }}
        >
          <Clock size={14} /> Novo canal/DM
        </Button>
      </div>
    </div>
  );
}
