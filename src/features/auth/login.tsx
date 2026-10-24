/**
 * Página de Login (Módulo 9: Controle de Acesso).
 * Tela de autenticação simples para demonstrar o sistema de permissões.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Mail, Lock } from 'lucide-react';
import { MOCK_USUARIOS } from './auth-types';

export interface LoginProps {
  onLogin: (usuario: typeof MOCK_USUARIOS[number]) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    // Simula chamada de API
    await new Promise((resolve) => setTimeout(resolve, 800));

    const usuario = MOCK_USUARIOS.find((u) => u.email === email);
    if (!usuario || senha !== '123456') {
      setErro('E-mail ou senha inválidos.');
      setCarregando(false);
      return;
    }

    if (usuario.status === 'inativo') {
      setErro('Usuário inativo. Entre em contato com o administrador.');
      setCarregando(false);
      return;
    }

    setCarregando(false);
    onLogin(usuario);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo ao CRM Super</CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Faça login para acessar o sistema de gestão.
          </p>
        </CardHeader>
        <CardContent>
          {erro && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-sm">
              {erro}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marina@crmsuper.example"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Senha padrão: 123456
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Entrando...
                </>
              ) : (
                <>
                  <ShieldAlert size={18} className="mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardContent className="p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              <Mail size={14} className="mr-1" />
              suporte@crmsuper.example
            </span>
            <span>
              <Lock size={14} className="mr-1" />
              Sistema seguro
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
