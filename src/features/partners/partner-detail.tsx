/**
 * Página de Detalhe do Parceiro com Extrato de Comissões (Módulo 7: Parceiros & Comissões).
 * Exibe dados cadastrais, regras de comissão e extrato de participação acumulada/a pagar.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Edit3,
} from 'lucide-react';
import { formatMoneyBRL } from '@/core/money';
import { formatDateBR } from '@/core/date';

export interface ParceiroDetalhe {
  id: string;
  nome: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  ie?: string;
  im?: string;
  categoria: string;
  status: 'ativo' | 'inativo';
  contato?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  regrasComissao: Array<{
    tipo: 'percentual' | 'fixo';
    valor: number;
    aplicaSobre: 'valorTotal' | 'lucro' | 'primeiraParcela';
  }>;
  comissaoAcumuladaCents: number;
  comissaoAPagarCents: number;
  notas: string[];
  cor: string;
  iniciales: string;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
  propostas: Array<{
    id: string;
    numero: string;
    projeto: string;
    cliente: string;
    valor: number;
    status: string;
    data: string;
    comissaoCents: number;
    comissaoPaga: boolean;
  }>;
}

export function ParceiroDetalhe({
  parceiro,
  onEditar,
  onVoltar,
  onDefinirComissao,
}: {
  parceiro: ParceiroDetalhe;
  onEditar: () => void;
  onVoltar: () => void;
  onDefinirComissao: (tipo: string, valor: number, aplicaSobre: string) => void;
}) {
  const [novaComissao, setNovaComissao] = useState<{
    tipo: 'percentual' | 'fixo';
    valor: number;
    aplicaSobre: 'valorTotal' | 'lucro' | 'primeiraParcela';
  } | null>(null);

  const comissoesPagas = parceiro.propostas.filter((p) => p.comissaoPaga).reduce((s, p) => s + p.comissaoCents, 0);
  const comissoesAPagar = parceiro.propostas.filter((p) => !p.comissaoPaga).reduce((s, p) => s + p.comissaoCents, 0);

  const aplicaSobreLabel: Record<string, string> = {
    valorTotal: 'Valor Total',
    lucro: 'Lucro',
    primeiraParcela: 'Primeira Parcela',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {parceiro.nome}
            {parceiro.nomeFantasia && (
              <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {parceiro.nomeFantasia}
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {parceiro.categoria} • {parceiro.cpfCnpj} • {parceiro.contato || 'Sem contato'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft size={18} /> Voltar
          </Button>
          <Button onClick={onEditar}>
            <Edit3 size={18} /> Editar
          </Button>
        </div>
      </div>

      {/* Métricas de comissão */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Comissão Acumulada
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
            {formatMoneyBRL({ cents: parceiro.comissaoAcumuladaCents })}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Comissão a Pagar
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatMoneyBRL({ cents: parceiro.comissaoAPagarCents })}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Propostas
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
            {parceiro.propostas.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda: dados cadastrais e comissões */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Cadastrais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Categoria</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{parceiro.categoria}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Documento</p>
                  <p className="text-sm font-mono text-slate-900 dark:text-slate-100">{parceiro.cpfCnpj}</p>
                </div>
                {parceiro.ie && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">IE</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{parceiro.ie}</p>
                  </div>
                )}
                {parceiro.im && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">IM</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{parceiro.im}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Contato</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{parceiro.contato || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">E-mail</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{parceiro.email || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Telefone</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{parceiro.telefone || '—'}</p>
                </div>
              </div>

              {parceiro.endereco && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Endereço</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{parceiro.endereco}</p>
                </div>
              )}

              {parceiro.notas && parceiro.notas.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Notas</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{parceiro.notas.join(' ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras de Comissão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {parceiro.regrasComissao.length > 0 ? (
                <div className="space-y-2">
                  {parceiro.regrasComissao.map((regra, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800/30">
                      <div>
                        <p className="text-sm text-slate-900 dark:text-slate-100">
                          {regra.tipo === 'percentual' ? `${regra.valor}%` : `R$ ${(regra.valor / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Aplica sobre: {aplicaSobreLabel[regra.aplicaSobre]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                  Nenhuma regra de comissão definida.
                </p>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Nova regra de comissão</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Tipo</label>
                    <select
                      value={novaComissao?.tipo ?? 'percentual'}
                      onChange={(e) => setNovaComissao({ ...novaComissao!, tipo: e.target.value as any })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="percentual">Percentual (%)</option>
                      <option value="fixo">Fixo (R$)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novaComissao?.valor ?? 0}
                      onChange={(e) => setNovaComissao({ ...novaComissao!, valor: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Aplica sobre</label>
                    <select
                      value={novaComissao?.aplicaSobre ?? 'valorTotal'}
                      onChange={(e) => setNovaComissao({ ...novaComissao!, aplicaSobre: e.target.value as any })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="valorTotal">Valor Total</option>
                      <option value="lucro">Lucro</option>
                      <option value="primeiraParcela">Primeira Parcela</option>
                    </select>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (novaComissao) {
                      onDefinirComissao(novaComissao.tipo, novaComissao.valor, novaComissao.aplicaSobre);
                      setNovaComissao(null);
                    }
                  }}
                  disabled={!novaComissao || novaComissao.valor <= 0}
                >
                  Adicionar regra
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita: extrato e ações */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extrato de Comissões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Acumulada</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">
                    {formatMoneyBRL({ cents: parceiro.comissaoAcumuladaCents })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Pagas</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {formatMoneyBRL({ cents: comissoesPagas })}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>a Pagar</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {formatMoneyBRL({ cents: comissoesAPagar })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => {
                  if (parceiro.email) {
                    window.location.href = `mailto:${parceiro.email}`;
                  }
                }}
              >
                Enviar e-mail
              </Button>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => {
                  const tel = parceiro.telefone;
                  if (tel) {
                    window.location.href = `tel:${tel.replace(/\D/g, '')}`;
                  }
                }}
              >
                Ligar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Status:{' '}
                <span
                  className={`text-xs font-semibold ${
                    parceiro.status === 'ativo'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {parceiro.status}
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cadastro: {formatDateBR(parceiro.criadoEm)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Versão: v{parceiro.versao}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabela de propostas com comissões */}
      {parceiro.propostas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Propostas com Participação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Nº Orçamento
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Cliente / Projeto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Comissão
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Situação
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parceiro.propostas.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">
                        {p.numero}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-slate-900 dark:text-slate-100 block">
                            {p.cliente}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {p.projeto}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">
                        {formatMoneyBRL({ cents: p.valor * 100 })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            p.status === 'aprovado'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : p.status === 'em_negociacao'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                : p.status === 'enviado'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-slate-900 dark:text-slate-100">
                        {formatMoneyBRL({ cents: p.comissaoCents })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            p.comissaoPaga
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {p.comissaoPaga ? 'Paga' : 'A pagar'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
