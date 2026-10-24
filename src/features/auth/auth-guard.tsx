/**
 * AuthGuard - Componente de controle de acesso (Módulo 9).
 * Verifica se o usuário tem permissão para acessar um módulo/ação.
 */

import { type Usuario, temPermissao } from './auth-types';

export interface AuthGuardProps {
  usuario: Usuario;
  modulo: string;
  acao: 'ler' | 'gravar' | 'excluir' | 'aprovar';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  usuario,
  modulo,
  acao,
  children,
  fallback,
}: AuthGuardProps) {
  const temPermissaoAcao = temPermissao(usuario, modulo, acao);

  if (!temPermissaoAcao) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
          🔒
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          Acesso restrito
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Você não tem permissão para esta ação.
        </p>
        {fallback}
      </div>
    );
  }

  return <>{children}</>;
}

export interface ModuloGuardProps {
  usuario: Usuario;
  modulo: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ModuloGuard({
  usuario,
  modulo,
  children,
  fallback,
}: ModuloGuardProps) {
  const podeLer = temPermissao(usuario, modulo, 'ler');

  if (!podeLer) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-4">
          🚫
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          Módulo não acessível
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Seu perfil ({usuario.cargo}) não tem acesso a este módulo.
        </p>
        {fallback}
      </div>
    );
  }

  return <>{children}</>;
}
