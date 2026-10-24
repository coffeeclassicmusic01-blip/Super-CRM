/**
 * Página de Detalhe do Cliente (Módulo 5).
 * Exibe histórico unificado: interações, orçamentos, etapas da venda, notas.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
} from 'lucide-react';
import { formatMoneyBRL } from '@/core/money';
import { formatDateBR } from '@/core/date';

export interface ClienteDetalhe {
  id: string;
  tipo: 'PF' | 'PJ';
  nome: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  ie?: string;
  im?: string;
  status: 'ativo' | 'inativo' | 'prospecto' | 'bloqueado';
  contato?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    uf: string;
    pais?: string;
  };
  notas: string[];
  cor: string;
  iniciales: string;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
  orcamentos: Array<{
    id: string;
    numero: string;
    projeto: string;
    valor: number;
    status: string;
    dataEmissao: string;
  }>;
  interacoes: Array<{
    data: string;
    tipo: 'contato' | 'reuniao' | 'email' | 'telefone' | 'nota';
    descricao: string;
    por: string;
  }>;
}

export function ClienteDetalhe({ cliente, onEditar, onVoltar }: { cliente: ClienteDetalhe; onEditar: () => void; onVoltar: () => void }) {
  const [tabAtiva, setTabAtiva] = useState<'resumo' | 'orcamentos' | 'interacoes'>('resumo');

  const totalOrcamentos = cliente.orcamentos.reduce((s, o) => s + o.valor, 0);
  const orcamentosAprovados = cliente.orcamentos.filter(o => o.status === 'aprovado').length;
  const valorAprovado = cliente.orcamentos
    .filter(o => o.status === 'aprovado')
    .reduce((s, o) => s + o.valor, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {cliente.nome}
            {cliente.nomeFantasia && (
              <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {cliente.nomeFantasia}
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'} •
            {cliente.cpfCnpj} • {cliente.contato || 'Sem contato'}
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

      {/* Métricas do cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total em orçamentos
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
            {formatMoneyBRL({ cents: totalOrcamentos * 100 })}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Orçamentos aprovados
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {orcamentosAprovados}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Valor aprovado
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatMoneyBRL({ cents: valorAprovado * 100 })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda: dados cadastrais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados cadastrais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tipo</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Documento</p>
                  <p className="text-sm font-mono text-slate-900 dark:text-slate-100">
                    {cliente.cpfCnpj}
                  </p>
                </div>
                {cliente.ie && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">IE</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{cliente.ie}</p>
                  </div>
                )}
                {cliente.im && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">IM</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{cliente.im}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Contato</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {cliente.contato || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">E-mail</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {cliente.email || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Telefone</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {cliente.telefone || '—'}
                  </p>
                </div>
              </div>

              {cliente.endereco && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Endereço</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {cliente.endereco.logradouro}, {cliente.endereco.numero}
                    {cliente.endereco.complemento ? ', ' + cliente.endereco.complemento : ''}
                  </p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {cliente.endereco.bairro}, {cliente.endereco.cidade} - {cliente.endereco.uf}
                  </p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    CEP: {cliente.endereco.cep} • {cliente.endereco.pais || 'Brasil'}
                  </p>
                </div>
              )}

              {cliente.notas && cliente.notas.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Notas</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{cliente.notas.join(' ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Abas: Orçamentos e Interações */}
          <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 mb-4">
            <button
              onClick={() => setTabAtiva('resumo')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tabAtiva === 'resumo'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Resumo
            </button>
            <button
              onClick={() => setTabAtiva('orcamentos')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tabAtiva === 'orcamentos'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Orçamentos ({cliente.orcamentos.length})
            </button>
            <button
              onClick={() => setTabAtiva('interacoes')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tabAtiva === 'interacoes'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Interações ({cliente.interacoes.length})
            </button>
          </div>

          {tabAtiva === 'resumo' && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do cadastro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        cliente.status === 'ativo'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : cliente.status === 'prospecto'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : cliente.status === 'inativo'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {cliente.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Cadastro</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      {formatDateBR(cliente.criadoEm)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Última atualização</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      {formatDateBR(cliente.atualizadoEm)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Versão</p>
                    <p className="text-sm text-slate-900 dark:text-slate-100">
                      v{cliente.versao}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {tabAtiva === 'orcamentos' && cliente.orcamentos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Orçamentos deste cliente</CardTitle>
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
                          Projeto
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Valor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cliente.orcamentos.map((o) => (
                        <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100">
                            {o.numero}
                          </td>
                          <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                            {o.projeto}
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                            {formatMoneyBRL({ cents: o.valor * 100 })}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                o.status === 'aprovado'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                  : o.status === 'em_negociacao'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                    : o.status === 'enviado'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {formatDateBR(o.dataEmissao)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {tabAtiva === 'interacoes' && cliente.interacoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Histórico de interações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cliente.interacoes.map((i, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300 shrink-0">
                        {i.tipo === 'telefone' ? <Phone size={14} /> : i.tipo === 'email' ? <Mail size={14} /> : i.tipo === 'reuniao' ? <FileText size={14} /> : <FileText size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-slate-100">{i.descricao}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {i.por} • {formatDateBR(i.data)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna direita: ações rápidas */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ações rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => {
                  // Navegar para novo orçamento vinculado
                  window.dispatchEvent(new CustomEvent('novo-orcamento-cliente', { detail: { clienteId: cliente.id, clienteNome: cliente.nome } }));
                }}
              >
                <FileText size={16} /> Novo orçamento
              </Button>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => {
                  if (cliente.email) {
                    window.location.href = `mailto:${cliente.email}`;
                  }
                }}
              >
                <Mail size={16} /> Enviar e-mail
              </Button>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => {
                  const tel = cliente.celular || cliente.telefone;
                  if (tel) {
                    window.location.href = `tel:${tel.replace(/\D/g, '')}`;
                  }
                }}
              >
                <Phone size={16} /> Ligar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações fiscais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tipo: {cliente.tipo === 'PF' ? 'PF' : 'PJ'}
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {cliente.cpfCnpj}
              </p>
              {cliente.ie && (
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  IE: {cliente.ie}
                </p>
              )}
              {cliente.im && (
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  IM: {cliente.im}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
