/**
 * Gerador de Propostas (Módulo 2: Gerador de Propostas, Simuladores & Layouts).
 * Preview em tempo real (Split View), seleção de templates, tabelas dinâmicas de preço com fotos.
 */

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteItemRow, type QuoteItemForm } from './quote-item-row';
import { z } from 'zod';
import { money, formatMoneyBRL } from '@/core/money';
import { LayoutTemplate, Send } from 'lucide-react';

const geradorSchema = z.object({
  clienteId: z.string().min(1, 'Selecione um cliente'),
  clienteNome: z.string().min(2, 'Nome do cliente é obrigatório'),
  projeto: z.string().min(2, 'Projeto deve ter pelo menos 2 caracteres'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  templateId: z.string().optional(),
  descontoPercentual: z.number().min(0).max(100).default(0),
  termos: z
    .object({
      validade: z.string().default('15 dias corridos'),
      pagamento: z.string().default('50% na aprovação e 50% na entrega'),
      entrega: z.string().default('Conforme cronograma acordado após aprovação'),
      garantia: z.string().default('90 dias de suporte para correções'),
    })
    .default({
      validade: '15 dias corridos',
      pagamento: '50% na aprovação e 50% na entrega',
      entrega: 'Conforme cronograma acordado após aprovação',
      garantia: '90 dias de suporte para correções',
    }),
  dataValidade: z.string().optional(),
});

export interface QuoteGeneratorProps {
  clientes: Array<{ id: string; nome: string }>;
  templates: Array<{ id: string; nome: string; categoria: string }>;
  onSave: (dados: any) => Promise<void> | void;
}

export function QuoteGenerator({
  clientes,
  templates,
  onSave,
}: QuoteGeneratorProps) {
  const [itens, setItens] = useState<QuoteItemForm[]>([
    { descricao: '', quantidade: 1, unidade: 'UN', valorUnitarioCents: 0 },
  ]);
  const [salvando, setSalvando] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const form = useForm<z.infer<typeof geradorSchema>>({
    resolver: zodResolver(geradorSchema),
    defaultValues: {
      clienteId: '',
      clienteNome: '',
      projeto: '',
      responsavel: '',
      templateId: '',
      descontoPercentual: 0,
      termos: {
        validade: '15 dias corridos',
        pagamento: '50% na aprovação e 50% na entrega',
        entrega: 'Conforme cronograma acordado após aprovação',
        garantia: '90 dias de suporte para correções',
      },
    },
  });

  const { register, handleSubmit, watch, formState: { errors } } = form;

  const desconto = watch('descontoPercentual', 0);
  const subtotal = itens.reduce((s, i) => s + i.quantidade * i.valorUnitarioCents, 0);
  const descontoCents = Math.round((subtotal * desconto) / 100);
  const total = subtotal - descontoCents;

  const adicionarItem = useCallback(() => {
    setItens([...itens, { descricao: '', quantidade: 1, unidade: 'UN', valorUnitarioCents: 0 }]);
  }, [itens]);

  const atualizarItem = (index: number, dados: Partial<QuoteItemForm>) => {
    setItens(itens.map((i, idx) => (idx === index ? { ...i, ...dados } : i)));
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, idx) => idx !== index));
  };

  async function onSubmit(dados: z.infer<typeof geradorSchema>) {
    setSalvando(true);
    try {
      const itensValidos = itens.filter((i) => i.descricao.trim() && i.valorUnitarioCents > 0);
      if (itensValidos.length === 0) {
        alert('Adicione ao menos um item ao orçamento.');
        return;
      }
      await onSave({ ...dados, itens: itensValidos });
    } finally {
      setSalvando(false);
    }
  }

  const tipoLabel = {
    servico: 'Serviço',
    produto: 'Produto',
    projeto: 'Projeto',
    consultoria: 'Consultoria',
    instalacao: 'Instalação',
    manutencao: 'Manutenção',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Cabeçalho com ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Gerador de Propostas
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Crie propostas comerciais com preview em tempo real e tabelas dinâmicas de preço.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPreviewOpen(true)}
          >
            <LayoutTemplate size={18} /> Preview
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={salvando}>
            <Send size={18} /> {salvando ? 'Salvando...' : 'Salvar orçamento'}
          </Button>
        </div>
      </div>

      {/* Formulário de parâmetros */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros da Proposta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <Label>Cliente*</Label>
              <Select
                {...register('clienteId')}
                onValueChange={(v) => {
                  form.setValue('clienteId', v as string);
                  const c = clientes.find((cl) => cl.id === v);
                  form.setValue('clienteNome', c?.nome ?? '');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clienteId && (
                <span className="text-xs text-red-500">{errors.clienteId.message}</span>
              )}
            </div>
            <div>
              <Label>Nome do cliente*</Label>
              <Input
                {...register('clienteNome')}
                placeholder="Nome do cliente"
                className={errors.clienteNome ? 'border-red-500' : ''}
              />
              {errors.clienteNome && (
                <span className="text-xs text-red-500">{errors.clienteNome.message}</span>
              )}
            </div>
            <div>
              <Label>Projeto*</Label>
              <Input
                {...register('projeto')}
                placeholder="Nome do projeto"
                className={errors.projeto ? 'border-red-500' : ''}
              />
              {errors.projeto && (
                <span className="text-xs text-red-500">{errors.projeto.message}</span>
              )}
            </div>
            <div>
              <Label>Responsável*</Label>
              <Input {...register('responsavel')} placeholder="Nome do responsável" />
            </div>
            <div>
              <Label>Template</Label>
              <Select {...register('templateId')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nenhum template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nome} ({tipoLabel[t.categoria as keyof typeof tipoLabel] ?? t.categoria})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Desconto (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  {...register('descontoPercentual')}
                  step="0.01"
                  className="pl-8"
                  placeholder="0"
                />
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs">%</span>
              </div>
              {errors.descontoPercentual && (
                <span className="text-xs text-red-500">{errors.descontoPercentual.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Validade da proposta</Label>
              <Select {...register('termos.validade')}>
                <SelectItem value="15 dias corridos">15 dias corridos</SelectItem>
                <SelectItem value="30 dias corridos">30 dias corridos</SelectItem>
                <SelectItem value="7 dias corridos">7 dias corridos</SelectItem>
                <SelectItem value="10 dias a partir do envio">10 dias a partir do envio</SelectItem>
              </Select>
            </div>
            <div>
              <Label>Condição de pagamento</Label>
              <Select {...register('termos.pagamento')}>
                <SelectItem value="50% na aprovação e 50% na entrega">
                  50% na aprovação e 50% na entrega
                </SelectItem>
                <SelectItem value="À vista com 5% de desconto">
                  À vista com 5% de desconto
                </SelectItem>
                <SelectItem value="3x sem juros no boleto">
                  3x sem juros no boleto
                </SelectItem>
                <SelectItem value="Entrada de 30% + 03 parcelas">
                  Entrada de 30% + 03 parcelas
                </SelectItem>
              </Select>
            </div>
            <div>
              <Label>Prazo de entrega</Label>
              <Select {...register('termos.entrega')}>
                <SelectItem value="Conforme cronograma acordado após aprovação">
                  Conforme cronograma acordado
                </SelectItem>
                <SelectItem value="30 dias úteis">30 dias úteis</SelectItem>
                <SelectItem value="60 dias úteis">60 dias úteis</SelectItem>
              </Select>
            </div>
            <div>
              <Label>Garantia</Label>
              <Select {...register('termos.garantia')}>
                <SelectItem value="90 dias de suporte para correções">
                  90 dias de suporte
                </SelectItem>
                <SelectItem value="30 dias de suporte">30 dias de suporte</SelectItem>
                <SelectItem value="6 meses de suporte">6 meses de suporte</SelectItem>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data de validade</Label>
              <Input
                type="date"
                {...register('dataValidade')}
                className={errors.dataValidade ? 'border-red-500' : ''}
              />
              {errors.dataValidade && (
                <span className="text-xs text-red-500">{errors.dataValidade.message}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela dinâmica de preços com fotos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Itens da Proposta</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={adicionarItem}
            >
              <Plus size={16} /> Adicionar item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {itens.map((item, index) => (
              <QuoteItemRow
                key={index}
                item={item}
                index={index}
                onUpdate={atualizarItem}
                onRemove={removerItem}
              />
            ))}
          </div>
          {itens.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Nenhum item adicionado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">
                  {formatMoneyBRL(money(subtotal))}
                </span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Desconto ({desconto}%)
                  </span>
                  <span className="font-mono text-red-600 dark:text-red-400">
                    -{formatMoneyBRL(money(descontoCents))}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-800 pt-2">
                <span className="text-slate-900 dark:text-slate-50">Total</span>
                <span className="text-slate-900 dark:text-slate-50">
                  {formatMoneyBRL(money(total))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                {...register('observacoes' as any)}
                rows={4}
                placeholder="Observações gerais da proposta..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Preview */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Preview da Proposta
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex">
              {/* Editando - Left */}
              <div className="w-1/2 border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">
                  Edição
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <div>
                      <Label>Cliente</Label>
                      <Input {...register('clienteNome')} />
                    </div>
                    <div>
                      <Label>Projeto</Label>
                      <Input {...register('projeto')} />
                    </div>
                    <div>
                      <Label>Valor Total</Label>
                      <div className="font-mono text-lg font-bold">
                        {formatMoneyBRL(money(total))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Atualizar Proposta
                    </Button>
                  </div>
                </form>
              </div>

              {/* Preview - Right */}
              <div className="w-1/2 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">
                  Visualização do Cliente
                </h3>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        Proposta Comercial
                      </h1>
                      <p className="text-slate-500 dark:text-slate-400">
                        {form.getValues('projeto')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {formatMoneyBRL(money(total))}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Válido até: {form.getValues('dataValidade') || '—'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                      Itens
                    </div>
                    {itens.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800/30"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.descricao}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.quantidade}× {item.unidade}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {formatMoneyBRL(money(item.quantidade * item.valorUnitarioCents))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total da Proposta</span>
                      <span>{formatMoneyBRL(money(total))}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                      Condições
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      <li>Validade: {form.getValues('termos.validade')}</li>
                      <li>Pagamento: {form.getValues('termos.pagamento')}</li>
                      <li>Entrega: {form.getValues('termos.entrega')}</li>
                      <li>Garantia: {form.getValues('termos.garantia')}</li>
                    </ul>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                      Fechar preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Plus(props: { size: number }) {
  return <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
