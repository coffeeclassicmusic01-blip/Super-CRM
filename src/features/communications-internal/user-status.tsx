/**
 * Indicador de Status do Usuário (Módulo 9: Comunicação Interna).
 * Exibe o status (Online, Ausente, Em Reunião, Offline) com cor.
 */

import { type User, statusLabel, statusColor } from './chat-types';

export interface UserStatusProps {
  usuario: User;
  tamanho?: 'pequeno' | 'medio';
}

export function UserStatus({ usuario, tamanho = 'medio' }: UserStatusProps) {
  const cor = statusColor[usuario.status];
  const label = statusLabel[usuario.status];
  const size = tamanho === 'pequeno' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <span
      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400"
      title={label}
    >
      <span className={`rounded-full ${cor} ${size} flex-shrink-0`} />
      <span>{label}</span>
    </span>
  );
}
