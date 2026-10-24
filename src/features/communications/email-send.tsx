/**
 * Envio de Proposta por E-mail (Módulo 8: Comunicação Externa & Envio).
 * Envia proposta para cliente com link público e anexo PDF opcional.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, FileText, CheckCircle2 } from 'lucide-react';
import { formatMoneyBRL } from '@/core/money';
import { emailService } from '@/services/email.service';

export interface EmailSendProps {
  orcamento: {
    id: string;
    numero: string;
    clienteNome: string;
    clienteEmail: string;
    projeto: string;
    totalCents: number;
    linkPublico?: string;
  };
  onEnviado: () => void;
}

export function EmailSend({ orcamento, onEnviado }: EmailSendProps) {
  const [para, setPara] = useState(orcamento.clienteEmail);
  const [assunto, setAssunto] = useState(`Sua proposta ${orcamento.numero} está pronta`);
  const [corpo, setCorpo] = useState(`
Olá ${orcamento.clienteNome},

Sua proposta ${orcamento.numero} para o projeto "${orcamento.projeto}" está disponível para revisão.

Valor total: ${formatMoneyBRL({ cents: orcamento.totalCents })}
Validade: 15 dias corridos

Acesse o link abaixo para revisar e aprovar digitalmente:
${orcamento.linkPublico ?? 'Link será gerado após salvar a configuração de e-mail.'}

Att.,
Equipe CRM Super
`);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleEnviar() {
    setEnviando(true);
    try {
      const resultado = await emailService.enviarProposta(para, orcamento.numero, orcamento.linkPublico ?? '');
      if (resultado.sucesso) {
        setEnviado(true);
        onEnviado();
      } else {
        alert(resultado.erro || 'Erro ao enviar e-mail.');
      }
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-900/20 bg-emerald-50 dark:bg-emerald-900/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">E-mail enviado com sucesso!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Proposta {orcamento.numero} enviada para {para}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-primary" />
          <CardTitle>Enviar Proposta por E-mail</CardTitle>
        </div>
        <CardDescription>
          Envie a proposta {orcamento.numero} para o cliente por e-mail.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Para*</Label>
            <Input
              value={para}
              onChange={(e) => setPara(e.target.value)}
              placeholder="cliente@exemplo.com"
            />
          </div>
          <div>
            <Label>Assunto*</Label>
            <Input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Corpo da mensagem</Label>
          <textarea
            value={corpo}
            onChange={(e) => setCorpo(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-slate-700 dark:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <FileText size={16} />
          <span>Anexo PDF da proposta será incluído automaticamente (funcionalidade em desenvolvimento).</span>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setEnviado(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleEnviar}
            disabled={enviando || !para.trim()}
          >
            {enviando ? 'Enviando...' : <><Send size={18} /> Enviar e-mail</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
