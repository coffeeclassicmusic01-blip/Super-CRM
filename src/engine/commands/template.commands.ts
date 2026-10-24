/**
 * Comandos de Template de Proposta (Módulo 2: Gerador de Propostas).
 */

import { z } from 'zod';
import type { CommandSpec } from '../command';
import { ok, err } from '../../core/result';
import type { CommandResult } from '../command';
import type { Template } from '../../domain/template';
import { novoTemplate } from '../../domain/template';

const criarTemplateSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  descricao: z.string().optional(),
  itens: z
    .array(
      z.object({
        descricao: z.string().min(1),
        unidade: z.string(),
        valorUnitarioCents: z.number().min(0),
        opcional: z.boolean().default(false),
      }),
    )
    .default([]),
  termosPadrao: z
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
});

export function templateCommands(): CommandSpec[] {
  return [
    {
      id: 'template.criar',
      label: 'Criar Template de Proposta',
      categoria: 'Templates',
      descricao: 'Cria um template reutilizável de proposta',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = criarTemplateSchema.safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar template');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<Template> => {
        const p = criarTemplateSchema.parse(params);
        const id = `TPL-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const template = novoTemplate(id, p.nome, p.categoria as any);
        template.descricao = p.descricao ?? undefined;
        template.itens = p.itens.map((i) => ({
          descricao: i.descricao,
          unidade: i.unidade,
          valorUnitarioCents: i.valorUnitarioCents,
          opcional: i.opcional,
        }));
        template.termosPadrao = p.termosPadrao;
        return ok(template);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'template.atualizar',
      label: 'Atualizar Template',
      categoria: 'Templates',
      descricao: 'Atualiza um template existente',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({ id: z.string(), campos: z.record(z.string(), z.any()) })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para atualizar template');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Template> => {
        const p = z
          .object({ id: z.string(), campos: z.record(z.string(), z.any()) })
          .parse(params);
        const s = state as { templates: Template[] };
        const idx = s.templates.findIndex((t) => t.id === p.id);
        if (idx < 0) return err('Template não encontrado');
        const atual = s.templates[idx];
        const atualizado = {
          ...atual,
          ...p.campos,
          atualizadoEm: new Date().toISOString(),
        } as Template;
        s.templates[idx] = atualizado;
        return ok(atualizado);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'template.ativarDesativar',
      label: 'Ativar/Desativar Template',
      categoria: 'Templates',
      descricao: 'Ativa ou desativa um template para uso em propostas',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({ id: z.string(), ativo: z.boolean() })
          .safeParse(params);
        if (!parsed.success) return err('ID e status ativo são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<void> => {
        const p = z
          .object({ id: z.string(), ativo: z.boolean() })
          .parse(params);
        const s = state as { templates: Template[] };
        const template = s.templates.find((t) => t.id === p.id);
        if (!template) return err('Template não encontrado');
        template.ativo = p.ativo;
        template.atualizadoEm = new Date().toISOString();
        return ok(undefined);
      },
      undoavel: true,
      abreDialog: false,
    },
  ];
}
