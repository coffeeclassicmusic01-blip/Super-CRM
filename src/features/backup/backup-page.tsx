/**
 * Página de Backups (Módulo 10: Rotina de Backups Automáticos na Nuvem).
 * Exportação manual, agendamento automático e histórico de backups.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Clock,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { backupService } from './backup-service';
import { type BackupData } from './backup-types';

export interface BackupPageProps {
  dados: BackupData;
  onImportarDados: (dados: BackupData) => void;
}

export function BackupPage({ dados, onImportarDados }: BackupPageProps) {
  const [backupando, setBackupando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro'>('sucesso');
  const [agendamento, setAgendamento] = useState(backupService.getAgendamento());
  const [historico, setHistorico] = useState(backupService.getHistorico());

  useEffect(() => {
    setAgendamento(backupService.getAgendamento());
    setHistorico(backupService.getHistorico());
  }, []);

  const exportarBackup = async () => {
    setBackupando(true);
    setMensagem(null);

    try {
      const resultado = await backupService.exportarDados(dados);
      if (resultado.sucesso) {
        setTipoMensagem('sucesso');
        setMensagem(`Backup exportado com sucesso: ${resultado.arquivo}`);
        setHistorico(backupService.getHistorico());
      } else {
        setTipoMensagem('erro');
        setMensagem(resultado.erro || 'Erro ao exportar backup');
      }
    } catch (e) {
      setTipoMensagem('erro');
      setMensagem(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setBackupando(false);
    }
  };

  const importarBackup = async (arquivo: File) => {
    setMensagem(null);

    try {
      const resultado = await backupService.importarDados(arquivo);
      if (resultado.sucesso) {
        const texto = await arquivo.text();
        const dadosImportados = JSON.parse(texto) as BackupData;
        onImportarDados(dadosImportados);

        setTipoMensagem('sucesso');
        setMensagem(`Backup importado com sucesso: ${resultado.arquivo}`);
        setHistorico(backupService.getHistorico());
      } else {
        setTipoMensagem('erro');
        setMensagem(resultado.erro || 'Erro ao importar backup');
      }
    } catch (e) {
      setTipoMensagem('erro');
      setMensagem(e instanceof Error ? e.message : 'Erro ao importar backup');
    } finally {
    }
  };

  const configurarAgendamento = async (ativo: boolean, intervalo: number) => {
    await backupService.configurarAgendamento(ativo, intervalo);
    setAgendamento(backupService.getAgendamento());
    setTipoMensagem('sucesso');
    setMensagem(
      `Backup automático ${ativo ? 'ativado' : 'desativado'} com sucesso`
    );
  };

  const executarBackupAgora = async () => {
    setBackupando(true);
    try {
      const resultado = await backupService.salvarBackupAutomatico(dados);
      if (resultado.sucesso) {
        setTipoMensagem('sucesso');
        setMensagem('Backup automático executado com sucesso');
        setHistorico(backupService.getHistorico());
      } else {
        setTipoMensagem('erro');
        setMensagem(resultado.erro || 'Erro no backup automático');
      }
    } catch (e) {
      setTipoMensagem('erro');
      setMensagem(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setBackupando(false);
    }
  };

  const recuperarBackupLocal = () => {
    const backupLocal = backupService.recuperarBackupLocal();
    if (backupLocal) {
      onImportarDados(backupLocal);
      setTipoMensagem('sucesso');
      setMensagem('Backup local recuperado com sucesso');
    } else {
      setTipoMensagem('erro');
      setMensagem('Nenhum backup local encontrado');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Backups e Restauração
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Exportação manual, backups automáticos e restauração de dados.
          </p>
        </div>
        <Button
          onClick={executarBackupAgora}
          disabled={backupando}
        >
          {backupando ? 'Fazendo backup...' : 'Fazer Backup Agora'}
        </Button>
      </div>

      {mensagem && (
        <div
          className={`rounded-lg p-4 flex items-center gap-3 ${
            tipoMensagem === 'sucesso'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {tipoMensagem === 'sucesso' ? (
            <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Bell size={20} className="text-rose-600 dark:text-rose-400" />
          )}
          <span className="text-sm">{mensagem}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exportação Manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Exporte todos os dados do CRM para um arquivo JSON. Ideal para
              backup manual ou migração.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <Download size={14} />
              <span>Formato: JSON • Inclui todos os módulos</span>
            </div>
            <Button
              onClick={exportarBackup}
              disabled={backupando}
              className="w-full"
            >
              {backupando ? 'Exportando...' : 'Exportar Backup Agora'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Importar Backup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Restaure dados de um arquivo de backup JSON previamente exportado.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const arquivo = e.target.files?.[0];
                if (arquivo) importarBackup(arquivo);
              }}
              className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400 cursor-pointer"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <Upload size={14} />
              <span>Selecione um arquivo .json de backup</span>
            </div>
            <Button
              onClick={recuperarBackupLocal}
              className="w-full"
            >
              Recuperar Backup Local
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup Automático</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Backup automático
              </span>
              <button
                onClick={() =>
                  configurarAgendamento(
                    !agendamento.ativo,
                    agendamento.intervaloHoras
                  )
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 ${
                  agendamento.ativo
                    ? 'bg-blue-600'
                    : 'bg-slate-200 dark:bg-slate-700'
                }"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    agendamento.ativo
                      ? 'translate-x-5'
                      : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>
            {agendamento.ativo && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Intervalo (horas)
                  </span>
                  <input
                    type="number"
                    value={agendamento.intervaloHoras}
                    onChange={(e) =>
                      configurarAgendamento(
                        agendamento.ativo,
                        parseInt(e.target.value) || 24
                      )
                    }
                    min="1"
                    max="168"
                    className="w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={14} />
                  <span>
                    Próximo backup:{' '}
                    {agendamento.proximoBackup
                      ? new Date(agendamento.proximoBackup).toLocaleString(
                          'pt-BR',
                          {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <RefreshCw size={14} />
                  <span>
                    Último backup:{' '}
                    {agendamento.ultimoBackup
                      ? new Date(agendamento.ultimoBackup).toLocaleString(
                          'pt-BR',
                          {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )
                      : '—'}
                  </span>
                </div>
              </div>
            )}
            {!agendamento.ativo && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Ative o backup automático para proteção contínua dos dados.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader>
          <CardTitle>Histórico de Backups</CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Clock size={32} className="mx-auto mb-4 opacity-30" />
              <p>Nenhum backup registrado ainda.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Data/Hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Registros
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Tamanho
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {historico.map((backup) => (
                  <tr
                    key={backup.id}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                      {new Date(backup.data).toLocaleString('pt-BR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          backup.tipo === 'automatico'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        }`}
                      >
                        {backup.tipo === 'automatico' ? 'Automático' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {backup.registros}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400 text-right">
                      {(backup.tamanhoBytes / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          backup.sucesso
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                        }`}
                      >
                        {backup.sucesso ? 'Sucesso' : 'Erro'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
          Como funciona
        </h3>
        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
          <li>
            <strong>Backup automático:</strong> Executado automaticamente conforme o
            intervalo configurado. Os dados são salvos no navegador (localStorage).
          </li>
          <li>
            <strong>Exportação manual:</strong> Gera um arquivo JSON com todos os dados
            do sistema para download e armazenamento externo.
          </li>
          <li>
            <strong>Restauração:</strong> Importe um arquivo JSON previamente exportado
            ou recupere o último backup automático salvo localmente.
          </li>
          <li>
            <strong>Segurança:</strong> Todos os dados permanecem no navegador do
            usuário. Nenhum dado é enviado para servidores externos.
          </li>
        </ul>
      </div>
    </div>
  );
}
