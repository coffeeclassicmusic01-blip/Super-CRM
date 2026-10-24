/**
 * Detalhe do Orçamento com Espelho de Pré-Nota (Módulo 4 & 6).
 * Exibe versão atual, histórico de revisões, link público, aceite digital e espelho de pré-nota fiscal.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GitBranch,
  Clock,
  Check,
  AlertTriangle,
  Receipt,
  Copy,
  Link,
} from 'lucide-react';
import { formatMoneyBRL } from '@/core/money';
import { formatDateBR } from '@/core/date';
import { estaVencido, diasParaVencimento } from '@/domain/quote';

export interface QuoteDetalhe {
  id: string;
  numero: string;
  clienteId: string;
  clienteNome: string;
  projeto: string;
  status: string;
  itens: Array<{
    descricao: string;
    quantidade: number;
    unidade: string;
    valorUnitarioCents: number;
  }>;
  subtotalCents: number;
  descontoPercentual: number;
  totalCents: number;
  termos: {
    validade: string;
    pagamento: string;
    entrega: string;
    garantia: string;
  };
  dataEmissao: string;
  dataValidade?: string;
  observacoes: string[];
  responsavel: string;
  parceiroIds: string[];
  revisaoDe?: string;
  numeroRevisao: number;
  historicoRevisoes: Array<{
    numero: number;
    motivo: string;
    data: string;
    por: string;
  }>;
  linkPublico?: string;
  aceitoEm?: string;
  aceitoIp?: string;
  templateId?: string;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
}

export function QuoteDetalhe({
  orcamento,
  onVoltar,
  onEditar,
  onNovaRevisao,
  onGerarLink,
  onAprovar,
  onGerarPreNota,
}: {
  orcamento: QuoteDetalhe;
  onVoltar: () => void;
  onEditar: () => void;
  onNovaRevisao: (motivo: string) => void;
  onGerarLink: () => void;
  onAprovar: (ip: string) => void;
  onGerarPreNota: () => void;
}) {
  const [linkCopiado, setLinkCopiado] = useState(false);

  const vencido = estaVencido(orcamento);
  const dias = diasParaVencimento(orcamento);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Orçamento {orcamento.numero}
            {orcamento.numeroRevisao > 1 && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <GitBranch size={12} /> Revisão {orcamento.numeroRevisao}
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {orcamento.clienteNome} • {orcamento.projeto}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onVoltar}>
            Voltar
          </Button>
          <Button onClick={onEditar}>
            Editar
          </Button>
        </div>
      </div>

      {/* Alertas de validade */}
      {orcamento.dataValidade && (
        <div
          className={`rounded-lg p-4 flex items-center gap-3 ${
            vencido
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : dias !== null && dias <= 7
                ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
          }`}
        >
          {vencido ? (
            <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
          ) : dias !== null && dias <= 7 ? (
            <Clock size={20} className="text-amber-600 dark:text-amber-400" />
          ) : (
            <Check size={20} className="text-emerald-600 dark:text-emerald-400" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {vencido ? 'Proposta vencida' : dias !== null && dias <= 7 ? 'Proposta prestes a vencer' : 'Proposta válida'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {vencido ? 'Esta proposta expirou em ' + formatDateBR(orcamento.dataValidade) :
                dias !== null ? `Vence em ${dias} dia(s) (${formatDateBR(orcamento.dataValidade)})` :
                'Sem data de validade definida'}
            </p>
          </div>
          {!vencido && orcamento.status !== 'aprovado' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAprovar('127.0.0.1')}
            >
              <Check size={16} /> Aprovar agora
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna esquerda: resumo e itens */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Cliente</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{orcamento.clienteNome}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Responsável</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{orcamento.responsavel}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    orcamento.status === 'aprovado'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : orcamento.status === 'em_negociacao'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        : orcamento.status === 'enviado'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : orcamento.status === 'rascunho'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {orcamento.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Emissão</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{formatDateBR(orcamento.dataEmissao)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Subtotal</p>
                  <p className="text-sm font-mono text-slate-900 dark:text-slate-100">
                    {formatMoneyBRL({ cents: orcamento.subtotalCents })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Desconto</p>
                  <p className="text-sm font-mono text-slate-900 dark:text-slate-100">
                    -{formatMoneyBRL({ cents: Math.round((orcamento.subtotalCents * orcamento.descontoPercentual) / 100) })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                    {formatMoneyBRL({ cents: orcamento.totalCents })}
                  </p>
                </div>
              </div>

              {orcamento.itens.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Itens</p>
                  <div className="space-y-1">
                    {orcamento.itens.map((item, i) => (
                      <div key={i} className="flex justify-between items-center px-2 py-1 text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {item.descricao} ({item.quantidade}× {item.unidade})
                        </span>
                        <span className="font-mono text-slate-900 dark:text-slate-100">
                          {formatMoneyBRL({ cents: item.quantidade * item.valorUnitarioCents })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {orcamento.observacoes.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Observações</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{orcamento.observacoes.join(' ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termos Comerciais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Validade</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{orcamento.termos.validade}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Pagamento</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{orcamento.termos.pagamento}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Entrega</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{orcamento.termos.entrega}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Garantia</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{orcamento.termos.garantia}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita: ações e revisões */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {orcamento.status !== 'aprovado' && (
                <Button
                  variant="outline"
                  className="w-full text-left"
                  onClick={() => onAprovar('127.0.0.1')}
                >
                  <Check size={16} /> Aprovar orçamento
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={onGerarLink}
              >
                <Link size={16} />
                {orcamento.linkPublico ? 'Atualizar link público' : 'Gerar link público'}
              </Button>
              {orcamento.linkPublico && (
                <Button
                  variant="outline"
                  className="w-full text-left"
                  onClick={() => {
                    const link = orcamento.linkPublico ?? '';
                    navigator.clipboard.writeText(link);
                    setLinkCopiado(true);
                    setTimeout(() => setLinkCopiado(false), 2000);
                  }}
                >
                  <Copy size={16} />
                  {linkCopiado ? 'Copiado!' : 'Copiar link'}
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={onGerarPreNota}
              >
                <Receipt size={16} /> Gerar pré-nota fiscal
              </Button>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => {
                  const motivo = prompt('Motivo da revisão:');
                  if (motivo) onNovaRevisao(motivo);
                }}
              >
                <GitBranch size={16} /> Nova revisão
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Revisões</CardTitle>
            </CardHeader>
            <CardContent>
              {orcamento.historicoRevisoes.length > 0 ? (
                <div className="space-y-3">
                  {orcamento.historicoRevisoes.map((r) => (
                    <div key={r.numero} className="flex gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/30">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                        R{r.numero}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-slate-100">{r.motivo}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {r.por} • {formatDateBR(r.data)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
                  Sem revisões. Esta é a versão original.
                </p>
              )}
            </CardContent>
          </Card>

          {orcamento.aceitoEm && (
            <Card>
              <CardHeader>
                <CardTitle>Aceite Digital</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  Aceito em {formatDateBR(orcamento.aceitoEm)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  IP: {orcamento.aceitoIp}
                </p>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Proposta aprovada digitalmente
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Espelho de Pré-Nota Fiscal (Módulo 6) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Espelho de Pré-Nota Fiscal</CardTitle>
            <Button
              variant="outline"
              onClick={onGerarPreNota}
              disabled={orcamento.status !== 'aprovado'}
            >
              <Receipt size={16} /> Copiar para Conta Azul
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50">Pré-Nota Faturável</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Espelho pronto para cópia rápida no Conta Azul
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                  {formatMoneyBRL({ cents: orcamento.totalCents })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Orçamento</p>
                <p className="text-sm font-mono text-slate-900 dark:text-slate-100">{orcamento.numero}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Cliente</p>
                <p className="text-sm text-slate-900 dark:text-slate-100">{orcamento.clienteNome}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Status</p>
                <span className="text-xs font-medium ${
                  orcamento.status === 'aprovado'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400'
                }">{orcamento.status}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Emissão</p>
                <p className="text-sm font-mono text-slate-900 dark:text-slate-100">{formatDateBR(orcamento.dataEmissao)}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Itens para faturamento</p>
              <div className="space-y-2">
                {orcamento.itens.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.descricao} ({item.quantidade} {item.unidade})
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">
                      {formatMoneyBRL({ cents: item.quantidade * item.valorUnitarioCents })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-900 dark:text-slate-50">Total para fatura</span>
                <span className="text-slate-900 dark:text-slate-50">
                  {formatMoneyBRL({ cents: orcamento.totalCents })}
                </span>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 italic">
              Dados copiados no formato compatível com Conta Azul. Use o botão acima para transferir.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
