/**
 * Visão Kanban Dinâmica (Módulo 3).
 * Quadro Kanban configurado de acordo com o fluxo selecionado.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  Clock,
  Plus,
  ArrowRight,
  Users,
} from 'lucide-react';
import { formatDateBR } from '@/core/date';

export interface KanbanColumn {
  id: string;
  nome: string;
  cor: string;
}

export interface KanbanCard {
  id: string;
  titulo: string;
  cliente?: string;
  responsavel: string;
  dataPrevista?: string;
  etapaId: string;
  cor: string;
}

export interface KanbanViewProps {
  workflowNome: string;
  colunas: KanbanColumn[];
  cards: KanbanCard[];
  onMudarEtapa: (cardId: string, novaEtapaId: string) => void;
  onAdicionarCard: (etapaId: string) => void;
  onEditarCard: (card: KanbanCard) => void;
}

export function KanbanView({
  workflowNome,
  colunas,
  cards,
  onMudarEtapa,
  onAdicionarCard,
  onEditarCard,
}: KanbanViewProps) {
  const [dragging, setDragging] = useState<string | null>(null);

  const cardsPorColuna = colunas.map((coluna) =>
    cards.filter((c) => c.etapaId === coluna.id),
  );

  const categoriaCor: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Kanban - {workflowNome}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Visão dinâmica configurada de acordo com o fluxo selecionado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <LayoutGrid size={16} /> Layout
          </Button>
          <Button variant="outline" size="sm">
            <Users size={16} /> Equipe
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" role="region" aria-label="Kanban board">
        {colunas.map((coluna, colIndex) => {
          const colunaCards = cardsPorColuna[colIndex];
          return (
            <div key={coluna.id} className="flex-shrink-0 w-[320px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoriaCor[coluna.cor] ?? categoriaCor.slate }} />
                  {coluna.nome}
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {colunaCards.length}
                </span>
              </div>

              <div
                className="min-h-[500px] bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging) {
                    const card = cards.find((c) => c.id === dragging);
                    if (card) {
                      onMudarEtapa(card.id, coluna.id);
                    }
                    setDragging(null);
                  }
                }}
              >
                {colunaCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-sm cursor-pointer group"
                    draggable
                    onDragStart={() => setDragging(card.id)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => onEditarCard(card)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: categoriaCor[card.cor] ?? categoriaCor.slate }}
                      />
                      <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {card.titulo}
                      </span>
                    </div>
                    {card.cliente && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {card.cliente}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {card.responsavel}
                      </span>
                      {card.dataPrevista && (
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          <Clock size={12} className="mr-1" />
                          {formatDateBR(card.dataPrevista)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {colunaCards.length === 0 && (
                  <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-sm">
                    Vazio
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onAdicionarCard(coluna.id)}
                >
                  <Plus size={14} /> Adicionar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Como usar o Kanban
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Arraste os cards entre as colunas para alterar a etapa. Clique em um card para editar detalhes.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <ArrowRight size={14} /> Ver calendário
          </Button>
        </div>
      </div>
    </div>
  );
}
