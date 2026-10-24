/**
 * Comandos de Workflow (Módulo 3: Construtor de Fluxos Personalizados & Etapas).
 * Criação de workflows, etapas, instâncias e agendamento de equipes externas.
 */

import { z } from 'zod';
import type { CommandSpec } from '../command';
import { ok, err } from '../../core/result';
import type { CommandResult } from '../command';
import {
  novoWorkflow,
  novoWorkflowStage,
  novoWorkflowInstance,
  proximaEtapa,
} from '../../domain/workflow';

const criarWorkflowSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  descricao: z.string().optional(),
  etapas: z
    .array(
      z.object({
        nome: z.string().min(1, 'Nome da etapa é obrigatório'),
        categoria: z.string().min(1, 'Categoria da etapa é obrigatória'),
        responsavel: z.string().min(1, 'Responsável é obrigatório'),
        anexosObrigatorios: z.array(z.string()).default([]),
        prazoDias: z.number().min(0, 'Prazo deve ser maior que zero'),
        cor: z.string().default('slate'),
      }),
    )
    .default([]),
});

export function workflowCommands(): CommandSpec[] {
  return [
    {
      id: 'workflow.criar',
      label: 'Criar Workflow',
      categoria: 'Workflows',
      descricao: 'Cria um fluxo personalizado com etapas ilimitadas',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = criarWorkflowSchema.safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar workflow');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<any> => {
        const p = criarWorkflowSchema.parse(params);
        const id = `WKF-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const workflow = novoWorkflow(id, p.nome, p.categoria as any);
        workflow.descricao = p.descricao ?? undefined;
        p.etapas.forEach((etapa, idx) => {
          workflow.etapas.push(
            novoWorkflowStage(
              `etp-${idx + 1}`,
              etapa.nome,
              etapa.categoria,
              etapa.responsavel,
              etapa.prazoDias,
              idx + 1,
            ),
          );
          workflow.etapas[workflow.etapas.length - 1].anexosObrigatorios =
            etapa.anexosObrigatorios;
          workflow.etapas[workflow.etapas.length - 1].cor = etapa.cor;
        });
        return ok(workflow);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'workflow.adicionarEtapa',
      label: 'Adicionar Etapa',
      categoria: 'Workflows',
      descricao: 'Adiciona uma etapa ao workflow',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            workflowId: z.string(),
            nome: z.string().min(1),
            categoria: z.string().min(1),
            responsavel: z.string().min(1),
            prazoDias: z.number().min(0),
            anexosObrigatorios: z.array(z.string()).default([]),
          })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros de etapa inválidos');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<any> => {
        const p = z
          .object({
            workflowId: z.string(),
            nome: z.string().min(1),
            categoria: z.string().min(1),
            responsavel: z.string().min(1),
            prazoDias: z.number().min(0),
            anexosObrigatorios: z.array(z.string()).default([]),
          })
          .parse(params);
        const s = state as { workflows: any[] };
        const workflow = s.workflows.find((w) => w.id === p.workflowId);
        if (!workflow) return err('Workflow não encontrado');
        const ordem = workflow.etapas.length + 1;
        const etapa = novoWorkflowStage(
          `etp-${Date.now()}`,
          p.nome,
          p.categoria,
          p.responsavel,
          p.prazoDias,
          ordem,
        );
        etapa.anexosObrigatorios = p.anexosObrigatorios;
        workflow.etapas.push(etapa);
        workflow.atualizadoEm = new Date().toISOString();
        workflow.versao += 1;
        return ok(workflow);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'workflow.reordenarEtapas',
      label: 'Reordenar Etapas',
      categoria: 'Workflows',
      descricao: 'Reordena as etapas do workflow (drag-and-drop)',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            workflowId: z.string(),
            etapaIds: z.array(z.string()),
          })
          .safeParse(params);
        if (!parsed.success) return err('IDs das etapas são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<any> => {
        const p = z
          .object({
            workflowId: z.string(),
            etapaIds: z.array(z.string()),
          })
          .parse(params);
        const s = state as { workflows: any[] };
        const workflow = s.workflows.find((w) => w.id === p.workflowId);
        if (!workflow) return err('Workflow não encontrado');
        const etapaMap = new Map(workflow.etapas.map((e: any) => [e.id, e]));
        workflow.etapas = p.etapaIds
          .map((id) => etapaMap.get(id))
          .filter(Boolean)
          .map((e, idx) => ({ ...e!, ordem: idx + 1 }));
        workflow.atualizadoEm = new Date().toISOString();
        workflow.versao += 1;
        return ok(workflow);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'workflow.criarInstancia',
      label: 'Criar Instância de Workflow',
      categoria: 'Workflows',
      descricao: 'Cria uma instância de workflow para um projeto/cliente',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            workflowId: z.string(),
            workflowNome: z.string(),
            projetoId: z.string().optional(),
            clienteId: z.string().optional(),
            clienteNome: z.string().optional(),
            responsavel: z.string().min(1),
          })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar instância');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<any> => {
        const p = z
          .object({
            workflowId: z.string(),
            workflowNome: z.string(),
            projetoId: z.string().optional(),
            clienteId: z.string().optional(),
            clienteNome: z.string().optional(),
            responsavel: z.string().min(1),
          })
          .parse(params);
        const id = `WKI-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const instance = novoWorkflowInstance(
          id,
          p.workflowId,
          p.workflowNome,
          p.responsavel,
        );
        instance.projetoId = p.projetoId ?? undefined;
        instance.clienteId = p.clienteId ?? undefined;
        instance.clienteNome = p.clienteNome ?? undefined;
        return ok(instance);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'workflow.concluirEtapa',
      label: 'Concluir Etapa',
      categoria: 'Workflows',
      descricao: 'Marca uma etapa como concluída',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            instanciaId: z.string(),
            etapaId: z.string(),
          })
          .safeParse(params);
        if (!parsed.success) return err('ID da instância e da etapa são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<any> => {
        const p = z
          .object({
            instanciaId: z.string(),
            etapaId: z.string(),
          })
          .safeParse(params);
        if (!p.success) return err(p.error.message);
        const { instanciaId, etapaId } = p.data;
        const s = state as { workflowInstances: any[]; workflows: any[] };
        const instance = s.workflowInstances.find((i) => i.id === instanciaId);
        if (!instance) return err('Instância não encontrada');
        const workflow = s.workflows.find((w) => w.id === instance.workflowId);
        if (!workflow) return err('Workflow não encontrado');
        const etapa = workflow.etapas.find((e: any) => e.id === etapaId);
        if (!etapa) return err('Etapa não encontrada');
        etapa.concluido = true;
        instance.atualizadoEm = new Date().toISOString();
        instance.versao += 1;
        // Avançar para próxima etapa pendente
        const prox = proximaEtapa(instance as any, workflow);
        if (prox) {
          instance.etapaAtualId = prox.id;
        } else {
          instance.status = 'concluido';
          instance.dataTerminoReal = new Date().toISOString();
        }
        return ok(instance);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'workflow.agendarEvento',
      label: 'Agendar Evento',
      categoria: 'Workflows',
      descricao: 'Agenda visita, medição ou instalação no calendário',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            instanciaId: z.string(),
            tipo: z.enum(['visita', 'medicao', 'instalacao']),
            titulo: z.string().min(1),
            dataInicio: z.string(),
            dataFim: z.string(),
            responsavel: z.string().min(1),
            local: z.string().optional(),
          })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros do evento inválidos');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<any> => {
        const p = z
          .object({
            instanciaId: z.string(),
            tipo: z.enum(['visita', 'medicao', 'instalacao']),
            titulo: z.string().min(1),
            dataInicio: z.string(),
            dataFim: z.string(),
            responsavel: z.string().min(1),
            local: z.string().optional(),
          })
          .parse(params);
        const s = state as { workflowInstances: any[] };
        const instance = s.workflowInstances.find((i) => i.id === p.instanciaId);
        if (!instance) return err('Instância não encontrada');
        const evento = {
          id: `cal-${Date.now()}`,
          tipo: p.tipo,
          titulo: p.titulo,
          descricao: undefined,
          dataInicio: p.dataInicio,
          dataFim: p.dataFim,
          responsavel: p.responsavel,
          local: p.local ?? undefined,
          status: 'agendado' as const,
          anexos: [],
        };
        instance.calendarioEventos.push(evento);
        instance.atualizadoEm = new Date().toISOString();
        instance.versao += 1;
        return ok(instance);
      },
      undoavel: true,
      abreDialog: false,
    },
  ];
}
