/**
 * Comandos de Parceiro de Negócios (Módulo 7: Parceiros & Comissões).
 */

import { z } from 'zod';
import type { CommandSpec } from '../command';
import { ok, err } from '../../core/result';
import type { CommandResult } from '../command';
import type { Partner } from '../../domain/partner';
import { novoPartner } from '../../domain/partner';

const criarPartnerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nomeFantasia: z.string().optional(),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  contato: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cor: z.string().default('slate'),
});

export function partnerCommands(): CommandSpec[] {
  return [
    {
      id: 'parceiro.criar',
      label: 'Criar Parceiro',
      categoria: 'Parceiros',
      descricao: 'Cadastra um novo parceiro de negócios',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = criarPartnerSchema.safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar parceiro');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<Partner> => {
        const p = criarPartnerSchema.parse(params);
        const id = `PAR-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const parceiro = novoPartner(id, p.nome, p.cpfCnpj, p.categoria as any);
        parceiro.nomeFantasia = p.nomeFantasia ?? undefined;
        parceiro.contato = p.contato ?? undefined;
        parceiro.email = p.email ?? undefined;
        parceiro.telefone = p.telefone ?? undefined;
        parceiro.endereco = p.endereco ?? undefined;
        parceiro.cor = p.cor;
        return ok(parceiro);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'parceiro.definirComissao',
      label: 'Definir Comissão',
      categoria: 'Parceiros',
      descricao: 'Define uma regra de comissão para o parceiro',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            id: z.string(),
            tipo: z.enum(['percentual', 'fixo']),
            valor: z.number().min(0),
            aplicaSobre: z.enum(['valorTotal', 'lucro', 'primeiraParcela']),
          })
          .safeParse(params);
        if (!parsed.success) return err('Parâmetros de comissão inválidos');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<void> => {
        const p = z
          .object({
            id: z.string(),
            tipo: z.enum(['percentual', 'fixo']),
            valor: z.number().min(0),
            aplicaSobre: z.enum(['valorTotal', 'lucro', 'primeiraParcela']),
          })
          .parse(params);
        const s = state as { parceiros: Partner[] };
        const parceiro = s.parceiros.find((x) => x.id === p.id);
        if (!parceiro) return err('Parceiro não encontrado');
        parceiro.regrasComissao.push({
          tipo: p.tipo,
          valor: p.valor,
          aplicaSobre: p.aplicaSobre,
        });
        parceiro.atualizadoEm = new Date().toISOString();
        parceiro.versao += 1;
        return ok(undefined);
      },
      undoavel: true,
      abreDialog: false,
    },
  ];
}
