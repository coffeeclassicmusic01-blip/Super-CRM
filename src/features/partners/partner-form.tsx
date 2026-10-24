/**
 * Formulário de Cadastro/Edição de Parceiro (Módulo 7: Parceiros & Comissões).
 * Usa react-hook-form + zod resolver.
 */

import { useState } from 'react';
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
import {
  partnerSchema,
  validarCPFCNPJParceiro,
  validarParceiro,
  type PartnerFormData,
  partnerCategories,
} from './partner-schema';
import { mascaraDocumento } from '@/core/cpf-cnpj';

export interface PartnerFormProps {
  dadosIniciais?: Partial<PartnerFormData>;
  onSave: (dados: PartnerFormData) => Promise<void> | void;
  onCancel?: () => void;
}

export function PartnerForm({
  dadosIniciais,
  onSave,
  onCancel,
}: PartnerFormProps) {
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      nome: '',
      nomeFantasia: '',
      cpfCnpj: '',
      categoria: partnerCategories[0],
      contato: '',
      email: '',
      telefone: '',
      endereco: '',
      notas: '',
      cor: 'slate',
      status: 'ativo',
      ...dadosIniciais,
    },
  });

  async function onSubmit(dados: PartnerFormData) {
    setErroServidor(null);
    setSalvando(true);
    try {
      const validacao = validarParceiro(dados);
      if (!validacao.valido) {
        setErroServidor('Dados inválidos. Corrija os campos destacados.');
        return;
      }

      if (dados.cpfCnpj && !validarCPFCNPJParceiro(dados.cpfCnpj.includes('/') ? 'PJ' : 'PF', dados.cpfCnpj)) {
        setErroServidor(
          dados.cpfCnpj.includes('/') ? 'CNPJ inválido.' : 'CPF inválido.'
        );
        return;
      }

      await onSave(dados);
    } catch (e) {
      setErroServidor(
        e instanceof Error ? e.message : 'Erro ao salvar parceiro.'
      );
    } finally {
      setSalvando(false);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const tipoLabel = dadosIniciais?.cpfCnpj?.includes('/') ? 'CNPJ' : 'CPF';
  const mascara = mascaraDocumento(dadosIniciais?.cpfCnpj?.includes('/') ? 'CNPJ' : 'CPF');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {erroServidor && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
            Erro
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {erroServidor}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Nome*</Label>
          <Input
            {...register('nome')}
            placeholder="Nome da empresa ou profissional"
            className={errors.nome ? 'border-red-500' : ''}
          />
          {errors.nome && (
            <span className="text-xs text-red-500">{errors.nome.message}</span>
          )}
        </div>

        <div>
          <Label>Nome fantasia</Label>
          <Input
            {...register('nomeFantasia')}
            placeholder="Nome fantasia (opcional)"
          />
        </div>

        <div>
          <Label>{tipoLabel}*</Label>
          <Input
            {...register('cpfCnpj')}
            placeholder={mascara}
            maxLength={18}
            className={errors.cpfCnpj ? 'border-red-500' : ''}
          />
          {errors.cpfCnpj && (
            <span className="text-xs text-red-500">{errors.cpfCnpj.message}</span>
          )}
        </div>

        <div>
          <Label>Categoria*</Label>
          <Select
            {...register('categoria')}
            onValueChange={(v) => {
              form.setValue('categoria', v as string);
              form.setValue('cpfCnpj', '');
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {partnerCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoria && (
            <span className="text-xs text-red-500">{errors.categoria.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <Label>Contato</Label>
          <Input
            {...register('contato')}
            placeholder="Nome do contato"
          />
        </div>
        <div>
          <Label>E-mail</Label>
          <Input
            {...register('email')}
            type="email"
            placeholder="contato@parceiro.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            {...register('telefone')}
            placeholder="(11) 0000-0000"
          />
        </div>
        <div className="col-span-2">
          <Label>Endereço</Label>
          <Input
            {...register('endereco')}
            placeholder="Logradouro, número, bairro, cidade"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Status</Label>
          <Select {...register('status')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Cor de identificação</Label>
          <Select {...register('cor')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a cor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slate">Slate</SelectItem>
              <SelectItem value="teal">Teal</SelectItem>
              <SelectItem value="violet">Violet</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="amber">Amber</SelectItem>
              <SelectItem value="rose">Rose</SelectItem>
              <SelectItem value="lime">Lime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Notas</Label>
          <textarea
            {...register('notas')}
            rows={3}
            placeholder="Observações sobre o parceiro..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel ?? (() => {})}>
          Cancelar
        </Button>
        <Button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar parceiro'}
        </Button>
      </div>
    </form>
  );
}
