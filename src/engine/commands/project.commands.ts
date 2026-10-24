/**
 * Comandos de Projeto (Módulo 3: Construtor de Fluxos Personalizados & Etapas).
 * Workflow com etapas ilimitadas, responsáveis, prazos, Kanban.
 */

import { z } from 'zod';
import type { CommandSpec } from '../command';
import { ok, err } from '../../core/result';
import type { CommandResult } from '../command';
import type { Project } from '../../domain/project';
import { novoProject } from '../../domain/project';

const criarProjectSchema = z.object({
  nome: z.string().min(2),
  clienteId: z.string(),
  clienteNome: z.string(),
  responsavel: z.string(),
  descricao: z.string().optional(),
});

export function projectCommands(): CommandSpec[] {
  return [
    {
      id: 'projeto.criar',
      label: 'Criar Projeto',
      categoria: 'Projetos',
      descricao: 'Cria um novo projeto vinculado a um cliente e orçamento',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = criarProjectSchema.safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar projeto');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<Project> => {
        const p = criarProjectSchema.parse(params);
        const id = `PROJ-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const projeto = novoProject(id, p.nome, p.clienteId, p.clienteNome, p.responsavel);
        projeto.descricao = p.descricao ?? undefined;
        return ok(projeto);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'projeto.adicionarEtapa',
      label: 'Adicionar Etapa',
      categoria: 'Projetos',
      descricao: 'Adiciona uma etapa ao workflow do projeto',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            projetoId: z.string(),
            nome: z.string().min(1),
            categoria: z.string(),
            responsavel: z.string(),
            prazoDias: z.number().min(0),
            anexosObrigatorios: z.array(z.string()).default([]),
          })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros de etapa inválidos');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Project> => {
        const p = z
          .object({
            projetoId: z.string(),
            nome: z.string().min(1),
            categoria: z.string(),
            responsavel: z.string(),
            prazoDias: z.number().min(0),
            anexosObrigatorios: z.array(z.string()).default([]),
          })
          .parse(params);
        const s = state as { projetos: Project[] };
        const projeto = s.projetos.find((x) => x.id === p.projetoId);
        if (!projeto) return err('Projeto não encontrado');
        const etapa = {
          id: `etapa-${Date.now()}`,
          nome: p.nome,
          categoria: p.categoria,
          responsavel: p.responsavel,
          anexosObrigatorios: p.anexosObrigatorios,
          prazoDias: p.prazoDias,
          ordem: projeto.etapas.length + 1,
          concluido: false,
        };
        projeto.etapas.push(etapa);
        projeto.atualizadoEm = new Date().toISOString();
        projeto.versao += 1;
        return ok(projeto);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'projeto.concluirEtapa',
      label: 'Concluir Etapa',
      categoria: 'Projetos',
      descricao: 'Marca uma etapa como concluída',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({ projetoId: z.string(), etapaId: z.string() })
          .safeParse(params);
        if (!parsed.success) return err('ID do projeto e da etapa são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<void> => {
        const p = z
          .object({ projetoId: z.string(), etapaId: z.string() })
          .parse(params);
        const s = state as { projetos: Project[] };
        const projeto = s.projetos.find((x) => x.id === p.projetoId);
        if (!projeto) return err('Projeto não encontrado');
        const etapa = projeto.etapas.find((e) => e.id === p.etapaId);
        if (!etapa) return err('Etapa não encontrada');
        etapa.concluido = true;
        etapa.dataConclusao = new Date().toISOString();
        projeto.atualizadoEm = new Date().toISOString();
        projeto.versao += 1;
        return ok(undefined);
      },
      undoavel: true,
      abreDialog: false,
    },
  ];
}
