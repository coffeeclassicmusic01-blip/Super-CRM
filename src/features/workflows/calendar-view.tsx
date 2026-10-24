/**
 * Calendário de Agendamentos (Módulo 3).
 * Calendário de visitas, medições e instalações para equipes externas.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  Plus,
} from 'lucide-react';
export interface CalendarEvent {
  id: string;
  tipo: 'visita' | 'medicao' | 'instalacao';
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  local?: string;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
}

export interface CalendarViewProps {
  eventos: CalendarEvent[];
  dataSelecionada: string;
  onDataChange: (data: string) => void;
  onAdicionarEvento: (evento: Omit<CalendarEvent, 'id'>) => void;
  onEditarEvento: (evento: CalendarEvent) => void;
}

const tipoConfig: Record<string, { cor: string; label: string; icone: any }> = {
  visita: { cor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', label: 'Visita', icone: MapPin },
  medicao: { cor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400', label: 'Medição', icone: Clock },
  instalacao: { cor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', label: 'Instalação', icone: Check },
};

export function CalendarView({
  eventos,
  dataSelecionada,
  onDataChange,
  onAdicionarEvento,
  onEditarEvento,
}: CalendarViewProps) {
  const [novoEvento, setNovoEvento] = useState<{
    tipo: 'visita' | 'medicao' | 'instalacao';
    titulo: string;
    descricao: string;
    responsavel: string;
    local: string;
  } | null>(null);

  const eventosDoDia = eventos.filter((e) => e.dataInicio.slice(0, 10) === dataSelecionada);

  const tipoCor: Record<string, string> = {
    visita: 'bg-blue-100 text-blue-700',
    medicao: 'bg-amber-100 text-amber-700',
    instalacao: 'bg-emerald-100 text-emerald-700',
  };

  const statusCor: Record<string, string> = {
    agendado: 'bg-slate-100 text-slate-700 dark:bg-slate-700/20 dark:text-slate-300',
    em_andamento: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    concluido: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    cancelado: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
  };

  const dataObj = new Date(dataSelecionada + 'T00:00:00');
  const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Calendário de Equipes Externas
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Agendamento de visitas, medições e instalações.
          </p>
        </div>
        <Button onClick={() => setNovoEvento({ tipo: 'visita', titulo: '', descricao: '', responsavel: '', local: '' })}>
          <Plus size={18} /> Novo agendamento
        </Button>
      </div>

      {/* Seletor de data */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <Calendar size={32} className="text-primary" />
          <div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {dataSelecionada.slice(8, 10)}/{dataSelecionada.slice(5, 7)}/{dataSelecionada.slice(0, 4)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            const d = new Date(dataSelecionada);
            d.setDate(d.getDate() - 1);
            onDataChange(d.toISOString().slice(0, 10));
          }}
        >
          ← Dia anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const d = new Date(dataSelecionada);
            d.setDate(d.getDate() + 1);
            onDataChange(d.toISOString().slice(0, 10));
          }}
        >
          Próximo dia →
        </Button>
        <Button
          variant="outline"
          onClick={() => onDataChange(new Date().toISOString().slice(0, 10))}
        >
          Hoje
        </Button>
      </div>

      {/* Eventos do dia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventosDoDia.length > 0 ? (
          eventosDoDia.map((evento) => {
            const cfg = tipoConfig[evento.tipo];
            return (
              <Card key={evento.id} className="border-l-4" style={{ borderLeftColor: cfg.cor === 'bg-blue-100' ? '#3b82f6' : cfg.cor === 'bg-amber-100' ? '#f59e0b' : '#22c55e' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${tipoCor[evento.tipo]}`} />
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        {cfg.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium ${statusCor[evento.status]}`}
                    >
                      {evento.status}
                    </span>
                  </div>
                  <CardTitle className="text-sm">
                    {evento.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {evento.descricao && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">{evento.descricao}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock size={14} />
                    <span>
                      {new Date(evento.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} -
                      {new Date(evento.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {evento.local && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin size={14} />
                      <span>{evento.local}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Users size={14} />
                    <span>{evento.responsavel}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditarEvento(evento)}
                  >
                    Editar
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p>Nenhum agendamento para esta data.</p>
            <Button
              variant="outline"
              onClick={() => setNovoEvento({ tipo: 'visita', titulo: '', descricao: '', responsavel: '', local: '' })}
            >
              <Plus size={16} /> Agendar primeiro evento
            </Button>
          </div>
        )}
      </div>

      {/* Modal de novo evento */}
      {novoEvento && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Novo Agendamento
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNovoEvento(null)}
              >
                <Check size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Tipo
                </label>
                <select
                  value={novoEvento.tipo}
                  onChange={(e) => setNovoEvento({ ...novoEvento, tipo: e.target.value as any })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="visita">Visita</option>
                  <option value="medicao">Medição</option>
                  <option value="instalacao">Instalação</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Título
                </label>
                <Input
                  value={novoEvento.titulo}
                  onChange={(e) => setNovoEvento({ ...novoEvento, titulo: e.target.value })}
                  placeholder="Título do agendamento"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Descrição
                </label>
                <textarea
                  value={novoEvento.descricao}
                  onChange={(e) => setNovoEvento({ ...novoEvento, descricao: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    Responsável
                  </label>
                  <Input
                    value={novoEvento.responsavel}
                    onChange={(e) => setNovoEvento({ ...novoEvento, responsavel: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    Local
                  </label>
                  <Input
                    value={novoEvento.local}
                    onChange={(e) => setNovoEvento({ ...novoEvento, local: e.target.value })}
                    placeholder="Local do atendimento"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setNovoEvento(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    onAdicionarEvento({
                      ...novoEvento!,
                      dataInicio: `${dataSelecionada}T09:00:00Z`,
                      dataFim: `${dataSelecionada}T11:00:00Z`,
                      status: 'agendado',
                    });
                    setNovoEvento(null);
                  }}
                  disabled={!novoEvento.titulo.trim()}
                >
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Input } from '@/components/ui/input';
