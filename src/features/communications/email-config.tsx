/**
 * Configuração de Email SMTP (Módulo 8: Comunicação Externa & Envio).
 * Permite configurar servidor SMTP para envio de propostas.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ShieldAlert } from 'lucide-react';

export interface EmailConfigForm {
  host: string;
  porta: number;
  usuario: string;
  senha: string;
  seguro: boolean;
  remetente: string;
}

export function EmailConfig({ onSave }: { onSave: (config: EmailConfigForm) => void }) {
  const [config, setConfig] = useState<EmailConfigForm>({
    host: 'smtp.gmail.com',
    porta: 587,
    usuario: '',
    senha: '',
    seguro: true,
    remetente: '',
  });
  const [salvo, setSalvo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function handleSave() {
    setSalvando(true);
    try {
      onSave(config);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-primary" />
          <CardTitle>Configuração de E-mail (SMTP)</CardTitle>
        </div>
        <CardDescription>
          Configure seu servidor SMTP para enviar propostas por e-mail.
          Suporta Gmail, Hotmail, Outlook e qualquer servidor SMTP.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Servidor SMTP*</Label>
            <Input
              {...{ value: config.host, onChange: (e) => setConfig({ ...config, host: e.target.value }) }}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div>
            <Label>Porta*</Label>
            <Input
              type="number"
              {...{ value: config.porta, onChange: (e) => setConfig({ ...config, porta: parseInt(e.target.value) || 587 }) }}
              placeholder="587"
            />
          </div>
          <div className="col-span-2">
            <Label>Usuário (e-mail)*</Label>
            <Input
              type="email"
              {...{ value: config.usuario, onChange: (e) => setConfig({ ...config, usuario: e.target.value }) }}
              placeholder="seuemail@dominio.com"
            />
          </div>
          <div className="col-span-2">
            <Label>Senha*</Label>
            <Input
              type="password"
              {...{ value: config.senha, onChange: (e) => setConfig({ ...config, senha: e.target.value }) }}
              placeholder="••••••••"
            />
          </div>
          <div className="col-span-2">
            <Label>Remetente*</Label>
            <Input
              {...{ value: config.remetente, onChange: (e) => setConfig({ ...config, remetente: e.target.value }) }}
              placeholder="seuemail@dominio.com"
            />
          </div>
          <div>
            <Label>Conexão segura (TLS/SSL)</Label>
            <button
              onClick={() => setConfig({ ...config, seguro: !config.seguro })}
              className={`flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors ${config.seguro ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <input type="checkbox" checked={config.seguro} onChange={() => {}} className="sr-only" />
              {config.seguro ? 'Ativada' : 'Desativada'}
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
            <ShieldAlert size={16} />
            <span>Dicas de configuração:</span>
          </div>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-4">
            <li>Gmail: use uma senha de app (não a senha da conta). Ative a verificação em duas etapas primeiro.</li>
            <li>Outlook/Hotmail: servidor smtp-mail.outlook.com, porta 587.</li>
            <li>Senhas são armazenadas apenas na sessão do navegador.</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            disabled={salvando}
            onClick={() => setSalvo(false)}
          >
            Limpar
          </Button>
          <Button
            onClick={handleSave}
            disabled={salvando || !config.host || !config.usuario || !config.senha || !config.remetente}
          >
            {salvando ? 'Salvando...' : salvo ? 'Salvo!' : 'Salvar configuração'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
