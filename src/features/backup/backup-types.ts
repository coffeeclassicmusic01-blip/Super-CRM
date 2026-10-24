/**
 * Tipos de Backup (Módulo 10: Rotina de Backups Automáticos na Nuvem).
 * Exportação manual e automática de dados do CRM.
 */

export type BackupStatus = 'idle' | 'backupando' | 'restaurando' | 'sucesso' | 'erro';

export type BackupData = {
  clientes: unknown[];
  parceiros: unknown[];
  orcamentos: unknown[];
  projetos: unknown[];
  pagamentos: unknown[];
  faturas: unknown[];
  workflows: unknown[];
  workflowInstances: unknown[];
  usuarios: unknown[];
  auditoria: unknown[];
  exportadoEm: string;
  versao: string;
};

export type BackupResult = {
  sucesso: boolean;
  arquivo?: string;
  tamanhoBytes?: number;
  erro?: string;
};

export type BackupAgendamento = {
  ativo: boolean;
  intervaloHoras: number;
  ultimoBackup?: string;
  proximoBackup?: string;
};

export type BackupHistorico = {
  id: string;
  data: string;
  tipo: 'automatico' | 'manual';
  tamanhoBytes: number;
  registros: number;
  sucesso: boolean;
};
