/**
 * Construtor de Workflows (Módulo 3).
 * Criação de workflows do zero com etapas ilimitadas e reordenação drag-and-drop.
 */

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ClipboardList,
  Settings,
} from 'lucide-react';
const builderSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  descricao: z.string().optional(),
});

export interface WorkflowBuilderProps {
  onSave: (dados: any) => Promise<void> | void;
  onCancel?: () => void;
}

export interface EtapaForm {
  nome: string;
  categoria: string;
  responsavel: string;
  anexosObrigatorios: string;
  prazoDias: number;
  cor: string;
}

export function WorkflowBuilder({ onSave, onCancel }: WorkflowBuilderProps) {
  const [etapas, setEtapas] = useState<EtapaForm[]>([]);
  const [salvando, setSalvando] = useState(false);

  const form = useForm<z.infer<typeof builderSchema>>({
    resolver: zodResolver(builderSchema),
    defaultValues: {
      nome: '',
      categoria: '',
      descricao: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const categorias = [
    'Instalação',
    'Venda',
    'Suporte',
    'Projeto',
    'Outro',
  ];

  const cores = [
    { valor: 'blue', label: 'Azul' },
    { valor: 'amber', label: 'Amarelo' },
    { valor: 'green', label: 'Verde' },
    { valor: 'violet', label: 'Violeta' },
    { valor: 'rose', label: 'Rosa' },
    { valor: 'slate', label: 'Cinza' },
  ];

  const adicionarEtapa = useCallback(() => {
    setEtapas([...etapas, {
      nome: '',
      categoria: '',
      responsavel: '',
      anexosObrigatorios: '',
      prazoDias: 1,
      cor: 'slate',
    }]);
  }, [etapas]);

  const removerEtapa = (index: number) => {
    setEtapas(etapas.filter((_, i) => i !== index));
  };

  const moverEtapa = (index: number, direcao: 'cima' | 'baixo') => {
    const novo = [...etapas];
    const alvo = direcao === 'cima' ? index - 1 : index + 1;
    if (alvo < 0 || alvo >= novo.length) return;
    [novo[index], novo[alvo]] = [novo[alvo], novo[index]];
    setEtapas(novo);
  };

  const atualizarEtapa = (index: number, campo: keyof EtapaForm, valor: any) => {
    setEtapas(etapas.map((e, i) => (i === index ? { ...e, [campo]: valor } : e)));
  };

  async function onSubmit(dados: z.infer<typeof builderSchema>) {
    setSalvando(true);
    try {
      const etapasValidas = etapas.filter((e) => e.nome.trim() && e.responsavel.trim());
      if (etapasValidas.length === 0) {
        alert('Adicione ao menos uma etapa ao workflow.');
        return;
      }
      await onSave({
        ...dados,
        etapas: etapasValidas.map((e, i) => ({
          ...e,
          ordem: i + 1,
          anexosObrigatorios: e.anexosObrigatorios
            ? e.anexosObrigatorios.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
        })),
      });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Construtor de Workflows
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Crie fluxos personalizados com etapas ilimitadas, responsáveis, prazos e anexos obrigatórios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel ?? (() => {})}>
            <ClipboardList size={18} /> Voltar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={salvando}>
            <Settings size={18} /> {salvando ? 'Salvando...' : 'Salvar workflow'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome*</Label>
              <Input
                {...register('nome')}
                placeholder="Nome do workflow"
                className={errors.nome ? 'border-red-500' : ''}
              />
              {errors.nome && (
                <span className="text-xs text-red-500">{errors.nome.message}</span>
              )}
            </div>
            <div>
              <Label>Categoria*</Label>
              <select
                {...register('categoria')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione a categoria</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.categoria && (
                <span className="text-xs text-red-500">{errors.categoria.message}</span>
              )}
            </div>
            <div className="col-span-2">
              <Label>Descrição</Label>
              <textarea
                {...register('descricao')}
                rows={3}
                placeholder="Descrição do workflow..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Etapas do Fluxo</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={adicionarEtapa}
            >
              <Plus size={16} /> Adicionar etapa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {etapas.map((etapa, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
              >
                <div className="flex items-center gap-1 shrink-0">
                  <ArrowUp
                    size={14}
                    onClick={(e) => { e.stopPropagation(); moverEtapa(index, 'cima'); }}
                    className={`cursor-pointer ${index === 0 ? 'opacity-50' : ''}`}
                  />
                  <ArrowDown
                    size={14}
                    onClick={(e) => { e.stopPropagation(); moverEtapa(index, 'baixo'); }}
                    className={`cursor-pointer ${index === etapas.length - 1 ? 'opacity-50' : ''} ml-1`}
                  />
                  <span className="text-xs font-bold text-slate-400">
                    {index + 1}
                  </span>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-2">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                      Nome da etapa
                    </label>
                    <Input
                      value={etapa.nome}
                      onChange={(e) => atualizarEtapa(index, 'nome', e.target.value)}
                      placeholder="Nome da etapa"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                      Responsável
                    </label>
                    <Input
                      value={etapa.responsavel}
                      onChange={(e) => atualizarEtapa(index, 'responsavel', e.target.value)}
                      placeholder="Responsável"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                      Prazo (dias)
                    </label>
                    <Input
                      type="number"
                      value={etapa.prazoDias}
                      onChange={(e) =>
                        atualizarEtapa(index, 'prazoDias', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                      Cor
                    </label>
                    <select
                      value={etapa.cor}
                      onChange={(e) => atualizarEtapa(index, 'cor', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {cores.map((c) => (
                        <option key={c.valor} value={c.valor}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                      Anexos obrigatórios
                    </label>
                    <Input
                      value={etapa.anexosObrigatorios}
                      onChange={(e) => atualizarEtapa(index, 'anexosObrigatorios', e.target.value)}
                      placeholder="ex: contrato, comprovante"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removerEtapa(index)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {etapas.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                Nenhuma etapa adicionada. Clique em "Adicionar etapa" para começar.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
          Como funciona
        </h3>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
          <li>Crie etapas ilimitadas para o seu fluxo de trabalho.</li>
          <li>Use as setas para reordenar as etapas (drag-and-drop visual).</li>
          <li>Defina responsáveis, prazos e anexos obrigatórios por etapa.</li>
          <li>Após salvar, o workflow estará disponível para criar instâncias em projetos.</li>
          <li>Acompanhe o progresso na visão Kanban e no calendário de equipes externas.</li>
        </ul>
      </div>
    </div>
  );
}
