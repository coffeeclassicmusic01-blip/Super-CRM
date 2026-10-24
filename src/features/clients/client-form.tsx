/**
 * Formulário de Cadastro/Edição de Cliente (Módulo 5).
 * Usa react-hook-form + zod resolver (boas práticas GeoStudio/wordcraft).
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
  clienteSchema,
  validarCPFCNPJ,
  validarCliente,
  type ClienteFormData,
} from './client-schema';
import { mascaraDocumento } from '@/core/cpf-cnpj';

export interface ClientFormProps {
  dadosIniciais?: Partial<ClienteFormData>;
  onSave: (dados: ClienteFormData) => Promise<void> | void;
  onCancel?: () => void;
  modoEdicao?: boolean;
}

export function ClientForm({
  dadosIniciais,
  onSave,
  onCancel,
}: ClientFormProps) {
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipo: 'PJ',
      nome: '',
      nomeFantasia: '',
      cpfCnpj: '',
      ie: '',
      im: '',
      contato: '',
      email: '',
      telefone: '',
      celular: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      pais: 'Brasil',
      notas: '',
      cor: 'slate',
      status: 'prospecto',
      ...dadosIniciais,
    },
  });

  async function onSubmit(dados: ClienteFormData) {
    setErroServidor(null);
    setSalvando(true);
    try {
      const validacao = validarCliente(dados);
      if (!validacao.valido) {
        setErroServidor('Dados inválidos. Corrija os campos destacados.');
        return;
      }

      if (dados.cpfCnpj && !validarCPFCNPJ(dados.tipo, dados.cpfCnpj)) {
        setErroServidor(
          dados.tipo === 'PF' ? 'CPF inválido.' : 'CNPJ inválido.'
        );
        return;
      }

      await onSave(dados);
    } catch (e) {
      setErroServidor(
        e instanceof Error ? e.message : 'Erro ao salvar cliente.'
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

  const tipoOptions = [
    { value: 'PF', label: 'Pessoa Física' },
    { value: 'PJ', label: 'Pessoa Jurídica' },
  ];

  const ufOptions = [
    'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'MS', 'MT',
    'DF', 'ES', 'PA', 'PB', 'PE', 'CE', 'MA', 'PI', 'RN', 'AL',
    'SE', 'RO', 'RR', 'AP', 'AM', 'TO',
  ];

  const tipoLabel = dadosIniciais?.tipo === 'PF' ? 'CPF' : 'CNPJ';
  const mascara = mascaraDocumento(dadosIniciais?.tipo === 'PF' ? 'CPF' : 'CNPJ');

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
        <div className="col-span-2">
          <Label>Tipo de pessoa</Label>
          <Select
            {...register('tipo')}
            onValueChange={(v) => {
              form.setValue('tipo', v as any);
              form.setValue('cpfCnpj', '');
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tipoOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nome*</Label>
          <Input
            {...register('nome')}
            placeholder="Nome completo ou razão social"
            className={errors.nome ? 'border-red-500' : ''}
          />
          {errors.nome && (
            <span className="text-xs text-red-500">{errors.nome.message}</span>
          )}
        </div>

        {dadosIniciais?.tipo === 'PJ' && (
          <div>
            <Label>Nome fantasia</Label>
            <Input
              {...register('nomeFantasia')}
              placeholder="Nome fantasia (opcional)"
            />
          </div>
        )}

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
          <Label>Inscrição Estadual (IE)</Label>
          <Input {...register('ie')} placeholder="IE (opcional)" />
        </div>

        <div>
          <Label>Inscrição Municipal (IM)</Label>
          <Input {...register('im')} placeholder="IM (opcional)" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Contato principal</Label>
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
            placeholder="contato@empresa.com"
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
        <div>
          <Label>Celular</Label>
          <Input
            {...register('celular')}
            placeholder="(11) 90000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>CEP</Label>
          <Input {...register('cep')} placeholder="00000-000" />
        </div>
        <div>
          <Label>Logradouro</Label>
          <Input {...register('logradouro')} placeholder="Rua, avenida..." />
        </div>
        <div>
          <Label>Número</Label>
          <Input {...register('numero')} placeholder="Nº" />
        </div>
        <div>
          <Label>Complemento</Label>
          <Input {...register('complemento')} placeholder="Apto, sala..." />
        </div>
        <div>
          <Label>Bairro</Label>
          <Input {...register('bairro')} placeholder="Bairro" />
        </div>
        <div>
          <Label>Cidade</Label>
          <Input {...register('cidade')} placeholder="Cidade" />
        </div>
        <div>
          <Label>UF</Label>
          <Select {...register('uf')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {ufOptions.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>País</Label>
          <Input {...register('pais')} defaultValue="Brasil" />
        </div>
      </div>

      <div>
        <Label>Status</Label>
        <Select {...register('status')}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prospecto">Prospecto</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="bloqueado">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Notas</Label>
          <textarea
            {...register('notas')}
            rows={3}
            placeholder="Observações sobre o cliente..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel ?? (() => {})}>
          Cancelar
        </Button>
        <Button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar cliente'}
        </Button>
      </div>
    </form>
  );
}
