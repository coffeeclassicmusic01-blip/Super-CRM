/**
 * Esquemas de validação Zod para Clientes (Módulo 5).
 * Todo dado de entrada é validado antes de chegar ao engine.
 */

import { z } from 'zod';
import { validarDocumento } from '@/core/cpf-cnpj';

export const clienteSchema = z.object({
  tipo: z.enum(['PF', 'PJ'], {
    required_error: 'Informe o tipo de pessoa (PF ou PJ)',
  }),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nomeFantasia: z.string().optional(),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  ie: z.string().optional(),
  im: z.string().optional(),
  contato: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  pais: z.string().default('Brasil'),
  notas: z.string().optional(),
  cor: z.string().default('slate'),
  status: z.enum(['ativo', 'inativo', 'prospecto', 'bloqueado']).default('prospecto'),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;

export function validarCliente(dados: unknown): { valido: boolean; dados?: ClienteFormData; erros?: Record<string, string> } {
  const resultado = clienteSchema.safeParse(dados);
  if (resultado.success) {
    return { valido: true, dados: resultado.data };
  }
  const erros: Record<string, string> = {};
  for (const [chave, problema] of Object.entries(resultado.error.flatten().fieldErrors)) {
    erros[chave] = Array.isArray(problema) ? problema[0] : String(problema);
  }
  return { valido: false, erros };
}

export function validarCPFCNPJ(tipo: 'PF' | 'PJ', valor: string): boolean {
  return validarDocumento(tipo === 'PF' ? 'CPF' : 'CNPJ', valor);
}
