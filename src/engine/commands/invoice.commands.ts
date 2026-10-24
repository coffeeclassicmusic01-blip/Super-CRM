/**
 * Comandos de Fatura / Espelho de Pré-Nota (Módulo 6).
 * Dados fiscais, validação CNPJ/CPF, itens, pagamento.
 */

import { z } from 'zod';
import type { CommandSpec } from '../command';
import { ok, err } from '../../core/result';
import type { CommandResult } from '../command';
import type { Invoice } from '../../domain/invoice';
import { novoInvoice } from '../../domain/invoice';

const criarInvoiceSchema = z.object({
  orcamentoId: z.string(),
  orcamentoNumero: z.string(),
  clienteId: z.string(),
  clienteNome: z.string(),
  tipo: z.string(),
});

export function invoiceCommands(): CommandSpec[] {
  return [
    {
      id: 'fatura.criar',
      label: 'Criar Fatura (Pré-Nota)',
      categoria: 'Faturamento',
      descricao: 'Cria um espelho de pré-nota fiscal a partir de um orçamento',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = criarInvoiceSchema.safeParse(params);
        if (!parsed.success) return err('Parâmetros inválidos para criar fatura');
        return ok(undefined);
      },
      run: (params: unknown, _state: unknown): CommandResult<Invoice> => {
        const p = criarInvoiceSchema.parse(params);
        const id = `NF-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 10000),
        ).padStart(4, '0')}`;
        const fatura = novoInvoice(
          id,
          id,
          p.orcamentoId,
          p.orcamentoNumero,
          p.clienteId,
          p.clienteNome,
        );
        fatura.tipo = p.tipo as any;
        return ok(fatura);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'fatura.atualizarFiscal',
      label: 'Atualizar Dados Fiscais',
      categoria: 'Faturamento',
      descricao: 'Atualiza os dados fiscais do cliente na fatura',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            id: z.string(),
            fiscal: z.object({
              razaoSocial: z.string(),
              cnpj: z.string(),
              ie: z.string(),
              im: z.string(),
              regime: z.string(),
              endereco: z.string(),
              cidade: z.string(),
              uf: z.string(),
              cep: z.string(),
              emailFiscal: z.string(),
            }),
          })
          .safeParse(params);
        if (!parsed.success) return err('Dados fiscais inválidos');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<void> => {
        const p = z
          .object({
            id: z.string(),
            fiscal: z.object({
              razaoSocial: z.string(),
              cnpj: z.string(),
              ie: z.string(),
              im: z.string(),
              regime: z.string(),
              endereco: z.string(),
              cidade: z.string(),
              uf: z.string(),
              cep: z.string(),
              emailFiscal: z.string(),
            }),
          })
          .parse(params);
        const s = state as { faturas: Invoice[] };
        const fatura = s.faturas.find((f) => f.id === p.id);
        if (!fatura) return err('Fatura não encontrada');
        fatura.fiscal = p.fiscal;
        fatura.atualizadoEm = new Date().toISOString();
        return ok(undefined);
      },
      undoavel: true,
      abreDialog: false,
    },
    {
      id: 'fatura.emitirNf',
      label: 'Emitir Nota Fiscal',
      categoria: 'Faturamento',
      descricao: 'Marca a fatura como NF Emitida e registra número/data',
      validate: (params: unknown): CommandResult<void> => {
        const parsed = z
          .object({
            id: z.string(),
            numeroNf: z.string().min(1),
            dataEmissao: z.string(),
            anexaPdf: z.boolean().default(false),
            anexaXml: z.boolean().default(false),
          })
          .safeParse(params);
        if (!parsed.success) return err('Número da NF e data de emissão são obrigatórios');
        return ok(undefined);
      },
      run: (params: unknown, state: unknown): CommandResult<Invoice> => {
        const p = z
          .object({
            id: z.string(),
            numeroNf: z.string().min(1),
            dataEmissao: z.string(),
            anexaPdf: z.boolean().default(false),
            anexaXml: z.boolean().default(false),
          })
          .parse(params);
        const s = state as { faturas: Invoice[] };
        const fatura = s.faturas.find((f) => f.id === p.id);
        if (!fatura) return err('Fatura não encontrada');
        fatura.status = 'nf_emitida';
        fatura.emissao.numeroNf = p.numeroNf;
        fatura.emissao.dataEmissao = p.dataEmissao;
        fatura.atualizadoEm = new Date().toISOString();
        fatura.historico.push({
          data: new Date().toISOString(),
          autor: 'sistema',
          acao: 'NF Emitida',
          detalhe: `NF-e ${p.numeroNf} emitida em ${p.dataEmissao}`,
          status: 'nf_emitida',
        });
        return ok(fatura);
      },
      undoavel: true,
      abreDialog: false,
    },
  ];
}
