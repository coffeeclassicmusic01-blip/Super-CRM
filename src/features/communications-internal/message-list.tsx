/**
 * Lista de Mensagens do Canal (Módulo 9: Comunicação Interna).
 * Exibe mensagens com menções (@usuario) e referências (#pedido).
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Message, getUserInitials } from './chat-types';
import { Clock } from 'lucide-react';

export interface MessageListProps {
  canalId: string;
  usuarioAtualId: string;
  onEnviar: (texto: string, mencoes: string[], referencias: string[]) => void;
}

export function MessageList({ canalId, usuarioAtualId, onEnviar }: MessageListProps) {
  const [texto, setTexto] = useState('');
  const [mensagens, setMensagens] = useState<Message[]>([]);

  const mensagensCanal = mensagens.filter((m) => m.canalId === canalId);

  const enviarMensagem = () => {
    if (!texto.trim()) return;

    const mencoes: string[] = [];
    const referencias: string[] = [];

    const palavras = texto.split(/\s+/);
    palavras.forEach((palavra) => {
      if (palavra.startsWith('@')) {
        mencoes.push(palavra.slice(1));
      }
      if (palavra.startsWith('#')) {
        referencias.push(palavra.slice(1));
      }
    });

    const novaMensagem: Message = {
      id: `MSG-${Date.now()}`,
      canalId,
      autorId: usuarioAtualId,
      autorNome: 'Usuário Atual',
      texto,
      mencoes,
      referencias,
      anexos: [],
      criadoEm: new Date().toISOString(),
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setTexto('');
    onEnviar(texto, mencoes, referencias);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagensCanal.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            <span className="text-2xl mb-2">💬</span>
            <p>Nenhuma mensagem ainda. Inicie a conversa.</p>
          </div>
        ) : (
          <div>
            {mensagensCanal.map((msg) => {
              const ehMeu = msg.autorId === usuarioAtualId;
              const iniciales = getUserInitials(msg.autorNome);

              return (
                <div
                  key={msg.id}
                  className={`flex ${ehMeu ? 'justify-end' : 'justify-start'} max-w-[80%]`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[70%] text-sm ${
                      ehMeu
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {!ehMeu && (
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}
                        >
                          {iniciales}
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {msg.autorNome}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(msg.criadoEm).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                    <div className="leading-relaxed">{formatarMensagem(msg.texto)}</div>
                    {ehMeu && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.criadoEm).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-emerald-500" title="Entregue">
                          <Clock size={10} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="flex items-center gap-2">
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviarMensagem();
              }
            }}
            placeholder="Escreva uma mensagem... (@usuario para mencionar, #pedido para referenciar)"
            className="flex-1"
          />
          <Button
            onClick={enviarMensagem}
            disabled={!texto.trim()}
            size="sm"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatarMensagem(texto: string): React.ReactNode {
  const partes: React.ReactNode[] = [];
  let ultimoIndex = 0;
  const regex = /@(\w+)|#(\w+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimoIndex) {
      partes.push(texto.slice(ultimoIndex, match.index));
    }
    if (match[1]) {
      partes.push(
        <span key={`m-${match.index}`} className="text-primary font-medium underline">
          @{match[1]}
        </span>
      );
    } else if (match[2]) {
      partes.push(
        <span key={`r-${match.index}`} className="text-amber-600 dark:text-amber-400 font-medium underline cursor-pointer hover:text-amber-500">
          #{match[2]}
        </span>
      );
    }
    ultimoIndex = match.index + match[0].length;
  }
  if (ultimoIndex < texto.length) {
    partes.push(texto.slice(ultimoIndex));
  }
  return partes;
}
