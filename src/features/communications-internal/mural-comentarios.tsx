/**
 * Mural de Comentários para Pedido/Orçamento (Módulo 9: Comunicação Interna).
 * Componente reutilizável para ser inserido dentro de um orçamento/projeto.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';
import { type Message, getUserInitials } from './chat-types';

export interface MuralComentariosProps {
  orcamentoId: string;
  usuarioId: string;
  usuarioNome: string;
}

export function MuralComentarios({
  orcamentoId,
  usuarioId,
  usuarioNome,
}: MuralComentariosProps) {
  const [texto, setTexto] = useState('');
  const [comentarios, setComentarios] = useState<Message[]>([
    {
      id: 'MSG-MURAL-001',
      canalId: orcamentoId,
      autorId: 'USR-001',
      autorNome: 'Marina Costa',
      texto: 'Revisado o escopo da proposta #ORC-2026-0001. Aguardando feedback do cliente.',
      mencoes: [],
      referencias: [orcamentoId],
      anexos: [],
      criadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'MSG-MURAL-002',
      canalId: orcamentoId,
      autorId: 'USR-002',
      autorNome: 'Lucas Silva',
      texto: 'Cliente solicitou ajuste no prazo de entrega.',
      mencoes: [],
      referencias: [orcamentoId],
      anexos: [],
      criadoEm: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const enviarComentario = () => {
    if (!texto.trim()) return;

    const referencias: string[] = [];
    const palavras = texto.split(/\s+/);
    palavras.forEach((palavra) => {
      if (palavra.startsWith('#')) {
        referencias.push(palavra.slice(1));
      }
    });

    const novo: Message = {
      id: `MSG-MURAL-${Date.now()}`,
      canalId: orcamentoId,
      autorId: usuarioId,
      autorNome: usuarioNome,
      texto,
      mencoes: [],
      referencias,
      anexos: [],
      criadoEm: new Date().toISOString(),
    };

    setComentarios((prev) => [novo, ...prev]);
    setTexto('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          <CardTitle>Mural de Comentários</CardTitle>
        </div>
        <CardDescription>
          Comentários vinculados ao orçamento {orcamentoId}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3">
          {comentarios.map((c) => (
            <div
              key={c.id}
              className="flex gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/30"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                {getUserInitials(c.autorNome)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
                  {c.texto}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {c.autorNome}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    • {new Date(c.criadoEm).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {comentarios.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <span className="text-2xl mb-2">💬</span>
              <p>Nenhum comentário ainda.</p>
            </div>
          )}
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-2">
            <Input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva um comentário... (#pedido para referenciar)"
              className="flex-1 text-sm"
            />
            <Button
              onClick={enviarComentario}
              disabled={!texto.trim()}
              size="sm"
            >
              <Users size={14} /> Comentar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
