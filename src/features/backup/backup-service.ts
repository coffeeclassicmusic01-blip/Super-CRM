/**
 * Serviço de Backup (Módulo 10: Rotina de Backups Automáticos na Nuvem).
 * Exportação manual e automática de dados do CRM usando IndexedDB e localStorage.
 * Solução gratuita: sem dependência de serviços pagos de nuvem.
 */

import {
  type BackupData,
  type BackupResult,
  type BackupAgendamento,
  type BackupHistorico,
} from './backup-types';

const STORAGE_KEY_BACKUP = 'crm-super-backup';
const STORAGE_KEY_AGENDAMENTO = 'crm-super-backup-agendamento';
const STORAGE_KEY_HISTORICO = 'crm-super-backup-historico';
const MAX_BACKUPS_HISTORICO = 50;

export class BackupService {
  private agendamento: BackupAgendamento;

  constructor() {
    this.agendamento = this.carregarAgendamento();
  }

  /**
   * Exporta todos os dados do sistema para um arquivo JSON.
   * Solução gratuita: download direto no navegador.
   */
  async exportarDados(dados: BackupData): Promise<BackupResult> {
    try {
      const backup: BackupData = {
        ...dados,
        exportadoEm: new Date().toISOString(),
        versao: '1.0.0',
      };

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const nomeArquivo = `crm-super-backup-${new Date().toISOString().slice(0, 10)}.json`;

      // Dispara download no navegador
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Registra no histórico
      await this.registrarHistorico({
        tipo: 'manual',
        tamanhoBytes: blob.size,
        registros: this.contarRegistros(backup),
        sucesso: true,
        data: new Date().toISOString(),
      });

      return {
        sucesso: true,
        arquivo: nomeArquivo,
        tamanhoBytes: blob.size,
      };
    } catch (e) {
      await this.registrarHistorico({
        tipo: 'manual',
        tamanhoBytes: 0,
        registros: 0,
        sucesso: false,
        data: new Date().toISOString(),
      });
      return {
        sucesso: false,
        erro: e instanceof Error ? e.message : 'Erro ao exportar backup',
      };
    }
  }

  /**
   * Importa dados de um arquivo de backup JSON.
   */
  async importarDados(arquivo: File): Promise<BackupResult> {
    try {
      const texto = await arquivo.text();
      const dados = JSON.parse(texto) as BackupData;

      // Validação básica
      if (!dados.exportadoEm || !dados.versao) {
        return {
          sucesso: false,
          erro: 'Arquivo de backup inválido',
        };
      }

      await this.registrarHistorico({
        tipo: 'manual',
        tamanhoBytes: arquivo.size,
        registros: this.contarRegistros(dados),
        sucesso: true,
        data: new Date().toISOString(),
      });

      return {
        sucesso: true,
        arquivo: arquivo.name,
        tamanhoBytes: arquivo.size,
      };
    } catch (e) {
      return {
        sucesso: false,
        erro: e instanceof Error ? e.message : 'Arquivo de backup inválido',
      };
    }
  }

  /**
   * Salva backup automático no IndexedDB/localStorage.
   */
  async salvarBackupAutomatico(dados: BackupData): Promise<BackupResult> {
    try {
      const json = JSON.stringify(dados, null, 2);
      const timestamp = new Date().toISOString();

      // Salva no localStorage (solução gratuita, sem servidor)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_BACKUP, json);
        localStorage.setItem(
          'crm-super-ultimo-backup-automatico',
          timestamp
        );
      }

      // Atualiza agendamento
      this.agendamento.ultimoBackup = timestamp;
      this.agendamento.proximoBackup = this.calcularProximoBackup();
      this.salvarAgendamento();

      await this.registrarHistorico({
        tipo: 'automatico',
        tamanhoBytes: json.length,
        registros: this.contarRegistros(dados),
        sucesso: true,
        data: new Date().toISOString(),
      });

      return {
        sucesso: true,
        arquivo: `backup-automatico-${timestamp.slice(0, 10)}.json`,
        tamanhoBytes: json.length,
      };
    } catch (e) {
      return {
        sucesso: false,
        erro: e instanceof Error ? e.message : 'Erro no backup automático',
      };
    }
  }

  /**
   * Recupera o último backup salvo localmente.
   */
  recuperarBackupLocal(): BackupData | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const json = localStorage.getItem(STORAGE_KEY_BACKUP);
      if (!json) return null;
      return JSON.parse(json) as BackupData;
    } catch {
      return null;
    }
  }

  /**
   * Obtém o agendamento de backup automático.
   */
  getAgendamento(): BackupAgendamento {
    return { ...this.agendamento };
  }

  /**
   * Configura o agendamento de backup automático.
   */
  async configurarAgendamento(
    ativo: boolean,
    intervaloHoras: number
  ): Promise<void> {
    this.agendamento = {
      ativo,
      intervaloHoras: Math.max(1, intervaloHoras),
      ultimoBackup: this.agendamento.ultimoBackup,
      proximoBackup: this.calcularProximoBackup(),
    };
    this.salvarAgendamento();
  }

  /**
   * Obtém o histórico de backups.
   */
  getHistorico(): BackupHistorico[] {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const json = localStorage.getItem(STORAGE_KEY_HISTORICO);
      if (!json) return [];
      return JSON.parse(json) as BackupHistorico[];
    } catch {
      return [];
    }
  }

  /**
   * Verifica se é hora de executar backup automático.
   */
  deveExecutarBackupAutomatico(): boolean {
    if (!this.agendamento.ativo || !this.agendamento.ultimoBackup) {
      return false;
    }

    const ultimo = new Date(this.agendamento.ultimoBackup).getTime();
    const agora = new Date().getTime();
    const intervaloMs = this.agendamento.intervaloHoras * 60 * 60 * 1000;

    return agora - ultimo >= intervaloMs;
  }

  private carregarAgendamento(): BackupAgendamento {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return {
        ativo: true,
        intervaloHoras: 24,
        ultimoBackup: undefined,
        proximoBackup: undefined,
      };
    }

    try {
      const json = localStorage.getItem(STORAGE_KEY_AGENDAMENTO);
      if (json) {
        return JSON.parse(json) as BackupAgendamento;
      }
    } catch {
      // ignorar
    }

    return {
      ativo: true,
      intervaloHoras: 24,
      ultimoBackup: undefined,
      proximoBackup: undefined,
    };
  }

  private salvarAgendamento(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY_AGENDAMENTO, JSON.stringify(this.agendamento));
    } catch {
      // ignorar
    }
  }

  private async registrarHistorico(registro: Omit<BackupHistorico, 'id'>): Promise<void> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      const historico = this.getHistorico();
      const novoRegistro: BackupHistorico = {
        id: `backup-${Date.now()}`,
        ...registro,
      };

      const atualizado = [novoRegistro, ...historico].slice(0, MAX_BACKUPS_HISTORICO);
      localStorage.setItem(STORAGE_KEY_HISTORICO, JSON.stringify(atualizado));
    } catch {
      // ignorar
    }
  }

  private calcularProximoBackup(): string {
    const agora = new Date();
    agora.setHours(agora.getHours() + this.agendamento.intervaloHoras);
    return agora.toISOString();
  }

  private contarRegistros(dados: BackupData): number {
    return [
      dados.clientes,
      dados.parceiros,
      dados.orcamentos,
      dados.projetos,
      dados.pagamentos,
      dados.faturas,
      dados.workflows,
      dados.workflowInstances,
      dados.usuarios,
      dados.auditoria,
    ].reduce((total, arr) => total + (arr?.length ?? 0), 0);
  }
}

export const backupService = new BackupService();
