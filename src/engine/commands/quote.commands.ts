/**
 * Comandos de Orçamento (Módulos 2, 4, 6).
 * Inclui versionamento (revisões), itens dinâmicos, termos fiscais, link público e aceite digital.
 */

import { z } from 'zod';
import type { CommandSpec } from '../command';
import { ok, err } from '../../core/result';
import type { CommandResult } from '../command';
import type { Quote } from '../../domain/quote';
import { novoQuote, novoQuoteDeTemplate, calcularTotal, novoNumeroRevisao } from '../../domain/quote';

const criarQuoteSchema = z.object({
  clienteId: z.string(),
  clienteNome: z.string(),
  projeto: z.string().min(2),
  responsavel: z.string(),
  templateId: z.string().optional(),
  itens: z
    .array(
      z.object({
        descricao: z.string().min(1),
        quantidade: z.number().min(1),
        unidade: z.string(),
        valorUnitarioCents: z.number().min(0),
        imagemUrl: z.string().optional(),
        observacao: z.string().optional(),
      }),
    )
    .default([]),
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
  parceiroIds: z.array(z.string()).default([]),
  dataValidade: z.string().optional(),
});

export function quoteCommands(): CommandSpec[] {
  return [
    {
      id: 'orcamento.criar',
      label: 'Criar Orçamento',
      categoria: 'Orçamentos',
      descricao: 'Cria um novo orçamento para um cliente',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = criarQuoteSchema.safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar orçamento');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Quote> => {
        const p = criarQuoteSchema.parse(params);
        const s = state as { orcamentos: Quote[]; templates?: Quote[] };
        const id = `ORC-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const numero = id;

        let orcamento: Quote;
        if (p.templateId) {
          // Aqui buscaríamos o template pelo estado, mas por simplicidade criamos do zero
          orcamento = novoQuote(
            id, numero, p.clienteId, p.clienteNome, p.projeto, p.responsavel,
          );
        } else {
          orcamento = novoQuote(
            id, numero, p.clienteId, p.clienteNome, p.projeto, p.responsavel,
          );
        }

        orcamento.itens = p.itens.map((i) => ({
          descricao: i.descricao,
          quantidade: i.quantidade,
          unidade: i.unidade,
          valorUnitarioCents: i.valorUnitarioCents,
          imagemUrl: i.imagemUrl,
          observacao: i.observacao,
        }));
        orcamento.descontoPercentual = p.descontoPercentual;
        orcamento.termos = p.termos;
        orcamento.parceiroIds = p.parceiroIds;
        orcamento.dataValidade = p.dataValidade;
        orcamento.templateId = p.templateId;
        const total = calcularTotal(orcamento);
        orcamento.subtotalCents = total.subtotal;
        orcamento.totalCents = total.total;
        s.orcamentos.push(orcamento);
        return ok(orcamento);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'orcamento.criarDeTemplate',
      label: 'Criar Orçamento de Template',
      categoria: 'Orçamentos',
      descricao: 'Cria um orçamento baseado em um template de proposta',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            clienteId: z.string(),
            clienteNome: z.string(),
            projeto: z.string().min(2),
            responsavel: z.string(),
            templateId: z.string(),
          })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar orçamento de template');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Quote> => {
        const p = z
          .object({
            clienteId: z.string(),
            clienteNome: z.string(),
            projeto: z.string().min(2),
            responsavel: z.string(),
            templateId: z.string(),
          })
          .parse(params);
        const s = state as { orcamentos: Quote[]; templates: any[] };
        const id = `ORC-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const numero = id;

        const template = s.templates?.find((t) => t.id === p.templateId);
        if (!template) return err('Template não encontrado');

        const orcamento = novoQuoteDeTemplate(
          id, numero, p.clienteId, p.clienteNome, p.projeto, p.responsavel,
          template as any,
        );
        s.orcamentos.push(orcamento);
        return ok(orcamento);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'orcamento.criarRevisao',
      label: 'Criar Revisão',
      categoria: 'Orçamentos',
      descricao: 'Cria uma nova revisão (v2, v3...) de um orçamento existente',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({ orcamentoId: z.string(), motivo: z.string() })
          .safeParse(params);
        if (!parsed.success) return err('ID do orçamento e motivo são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Quote> => {
        const p = z
          .object({ orcamentoId: z.string(), motivo: z.string() })
          .parse(params);
        const s = state as { orcamentos: Quote[] };
        const original = s.orcamentos.find((o) => o.id === p.orcamentoId);
        if (!original) return err('Orçamento não encontrado');
        const numeroRevisao = (original.numeroRevisao ?? 1) + 1;
        const novoId = novoNumeroRevisao(original);
        const revisao: Quote = {
          ...original,
          id: novoId,
          numero: novoId,
          revisaoDe: original.revisaoDe ?? original.id,
          numeroRevisao,
          status: 'rascunho',
          historicoRevisoes: [
            ...original.historicoRevisoes,
            {
              numero: numeroRevisao,
              motivo: p.motivo,
              data: new Date().toISOString(),
              por: 'usuario',
            },
          ],
          aceitoEm: undefined,
          aceitoIp: undefined,
          atualizadoEm: new Date().toISOString(),
          versao: original.versao + 1,
        };
        s.orcamentos.push(revisao);
        return ok(revisao);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'orcamento.atualizarStatus',
      label: 'Atualizar Status do Orçamento',
      categoria: 'Orçamentos',
      descricao: 'Muda o status de um orçamento (rascunho, enviado, aprovado, etc)',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            id: z.string(),
            status: z.enum([
              'rascunho',
              'enviado',
              'em_negociacao',
              'aprovado',
              'perdido',
              'cancelado',
            ]),
          })
          .safeParse(params);
        if (!parsed.success) return err('ID e status válidos são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Quote> => {
        const p = z
          .object({
            id: z.string(),
            status: z.enum([
              'rascunho',
              'enviado',
              'em_negociacao',
              'aprovado',
              'perdido',
              'cancelado',
            ]),
          })
          .parse(params);
        const s = state as { orcamentos: Quote[] };
        const orcamento = s.orcamentos.find((o) => o.id === p.id);
        if (!orcamento) return err('Orçamento não encontrado');
        orcamento.status = p.status;
        orcamento.atualizadoEm = new Date().toISOString();
        orcamento.versao += 1;
        return ok(orcamento);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'orcamento.atualizarValidade',
      label: 'Atualizar Validade',
      categoria: 'Orçamentos',
      descricao: 'Define ou atualiza a data de validade da proposta',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({ id: z.string(), dataValidade: z.string() })
          .safeParse(params);
        if (!parsed.success) return err('ID e data de validade são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Quote> => {
        const p = z
          .object({ id: z.string(), dataValidade: z.string() })
          .parse(params);
        const s = state as { orcamentos: Quote[] };
        const orcamento = s.orcamentos.find((o) => o.id === p.id);
        if (!orcamento) return err('Orçamento não encontrado');
        orcamento.dataValidade = p.dataValidade;
        orcamento.atualizadoEm = new Date().toISOString();
        orcamento.versao += 1;
        return ok(orcamento);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'orcamento.registrarAceite',
      label: 'Registrar Aceite Digital',
      categoria: 'Orçamentos',
      descricao: 'Registra o aceite da proposta via link público (Módulo 4)',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            id: z.string(),
            ip: z.string().optional(),
            dataHora: z.string().optional(),
          })
          .safeParse(params);
        if (!parsed.success) return err('ID do orçamento é obrigatório');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Quote> => {
        const p = z
          .object({
            id: z.string(),
            ip: z.string().optional(),
            dataHora: z.string().optional(),
          })
          .parse(params);
        const s = state as { orcamentos: Quote[] };
        const orcamento = s.orcamentos.find((o) => o.id === p.id);
        if (!orcamento) return err('Orçamento não encontrado');
        orcamento.status = 'aprovado';
        orcamento.aceitoEm = p.dataHora ?? new Date().toISOString();
        orcamento.aceitoIp = p.ip ?? '0.0.0.0';
        orcamento.atualizadoEm = new Date().toISOString();
        orcamento.versao += 1;
        return ok(orcamento);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'orcamento.gerarLinkPublico',
      label: 'Gerar Link Público',
      categoria: 'Orçamentos',
      descricao: 'Gera um link público interativo para o cliente aprovar a proposta',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z.object({ id: z.string() }).safeParse(params);
        if (!parsed.success) return err('ID do orçamento é obrigatório');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<{ link: string }> => {
        const p = z.object({ id: z.string() }).parse(params);
        const link = `https://crm-super.example/proposta/${p.id}`;
        return ok({ link });
      },
      undoavel: false,
      abreDialog: false,
    },
  ];
}
