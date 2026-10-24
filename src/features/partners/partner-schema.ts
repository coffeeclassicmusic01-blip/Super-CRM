/**
 * Esquemas de validação Zod para Parceiros (Módulo 7: Parceiros & Comissões).
 * Todo dado de entrada é validado antes de chegar ao engine.
 */

import { z } from 'zod';
import { validarDocumento } from '@/core/cpf-cnpj';

export const partnerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nomeFantasia: z.string().optional(),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  contato: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  notas: z.string().optional(),
  cor: z.string().default('slate'),
  status: z.enum(['ativo', 'inativo']).default('ativo'),
});

export type PartnerFormData = z.infer<typeof partnerSchema>;

export const comissaoSchema = z.object({
  parceiroId: z.string().min(1, 'Selecione um parceiro'),
  tipo: z.enum(['percentual', 'fixo']),
  valor: z.number().min(0, 'Valor deve ser maior que zero'),
  aplicaSobre: z.enum(['valorTotal', 'lucro', 'primeiraParcela']),
});

export type ComissaoFormData = z.infer<typeof comissaoSchema>;

export function validarParceiro(dados: unknown): { valido: boolean; dados?: PartnerFormData; erros?: Record<string, string> } {
  const resultado = partnerSchema.safeParse(dados);
  if (resultado.success) {
    return { valido: true, dados: resultado.data };
  }
  const erros: Record<string, string> = {};
  for (const [chave, problema] of Object.entries(resultado.error.flatten().fieldErrors)) {
    erros[chave] = Array.isArray(problema) ? problema[0] : String(problema);
  }
  return { valido: false, erros };
}

export function validarCPFCNPJParceiro(tipo: 'PF' | 'PJ', valor: string): boolean {
  return validarDocumento(tipo === 'PF' ? 'CPF' : 'CNPJ', valor);
}

export const partnerCategories = [
  'Design',
  'Desenvolvimento',
  'Marketing',
  'Consultoria',
  'Gráfica',
  'Instalação',
  'Suporte',
  'Outro',
] as const;

export type PartnerCategory = typeof partnerCategories[number];
