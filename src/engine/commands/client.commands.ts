/**
 * Comandos de Cliente (Módulo 5: CRM & Gestão de Clientes).
 * Validação com Zod, padrão Command de wordcraft/gridcraft.
 */

import { z } from 'zod';
import type { CommandSpec } from '../command';
import { ok, err } from '../../core/result';
import type { CommandResult } from '../command';
import type { Client } from '../../domain/client';
import { novoClient } from '../../domain/client';

const criarClientSchema = z.object({
  tipo: z.enum(['PF', 'PJ']),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nomeFantasia: z.string().optional(),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  contato: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  cor: z.string().default('slate'),
});

export function clientCommands(): CommandSpec[] {
  return [
    {
      id: 'cliente.criar',
      label: 'Criar Cliente',
      categoria: 'Clientes',
      descricao: 'Cadastra um novo cliente (PF ou PJ)',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = criarClientSchema.safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar cliente');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<Client> => {
        const p = criarClientSchema.parse(params);
        const id = `CLI-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const cliente = novoClient(id, p.tipo, p.nome, p.cpfCnpj);
        cliente.nomeFantasia = p.nomeFantasia ?? undefined;
        cliente.contato = p.contato ?? undefined;
        cliente.email = p.email ?? undefined;
        cliente.telefone = p.telefone ?? undefined;
        cliente.cor = p.cor;
        return ok(cliente);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'cliente.atualizar',
      label: 'Atualizar Cliente',
      categoria: 'Clientes',
      descricao: 'Atualiza dados de um cliente existente',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({ id: z.string(), campos: z.record(z.string(), z.any()) })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para atualizar cliente');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Client> => {
        const p = z
          .object({ id: z.string(), campos: z.record(z.string(), z.any()) })
          .parse(params);
        const s = state as { clientes: Client[] };
        const idx = s.clientes.findIndex((c) => c.id === p.id);
        if (idx < 0) return err('Cliente não encontrado');
        const atual = s.clientes[idx];
        const atualizado = {
          ...atual,
          ...p.campos,
          atualizadoEm: new Date().toISOString(),
          versao: atual.versao + 1,
        } as Client;
        s.clientes[idx] = atualizado;
        return ok(atualizado);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'cliente.remover',
      label: 'Remover Cliente',
      categoria: 'Clientes',
      descricao: 'Remove um cliente do sistema',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z.object({ id: z.string() }).safeParse(params);
        if (!parsed.success) return err('ID do cliente é obrigatório');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<void> => {
        const p = z.object({ id: z.string() }).parse(params);
        const s = state as { clientes: Client[] };
        const antes = s.clientes.length;
        s.clientes = s.clientes.filter((c) => c.id !== p.id);
        if (s.clientes.length === antes) return err('Cliente não encontrado');
        return ok(undefined);
      },
      undoavel: true,
      abreDialog: false,
    },
  ];
}
