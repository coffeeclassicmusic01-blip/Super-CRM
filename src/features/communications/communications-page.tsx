/**
 * Página de Comunicação Externa (Módulo 8).
 * Integra configuração SMTP, envio de e-mail e WhatsApp.
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone } from 'lucide-react';
import { EmailConfig } from './email-config';
import { EmailSend } from './email-send';
import { WhatsAppSend } from './whatsapp-send';

export interface CommunicationsPageProps {
  orcamento: {
    id: string;
    numero: string;
    clienteNome: string;
    clienteEmail: string;
    telefone: string;
    projeto: string;
    totalCents: number;
    linkPublico?: string;
  };
  onEnviado: () => void;
}

export function CommunicationsPage({
  orcamento,
  onEnviado,
}: CommunicationsPageProps) {
  const [abaAtiva, setAbaAtiva] = useState<'email' | 'whatsapp'>('email');
  const [smtpConfigurado, setSmtpConfigurado] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Comunicação Externa
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Envio de propostas por e-mail (SMTP) e WhatsApp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            smtpConfigurado
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
          }`}>
            {smtpConfigurado ? 'SMTP configurado' : 'SMTP não configurado'}
          </span>
        </div>
      </div>

      <Tabs
        value={abaAtiva}
        onValueChange={(v) => setAbaAtiva(v as 'email' | 'whatsapp')}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="email" className="flex-1">
            <Mail size={18} className="mr-2" />
            E-mail (SMTP)
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex-1">
            <Phone size={18} className="mr-2" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-6 space-y-6">
          <EmailConfig onSave={() => setSmtpConfigurado(true)} />
          <EmailSend orcamento={orcamento} onEnviado={onEnviado} />
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6 space-y-6">
          <WhatsAppSend
            telefone={orcamento.telefone}
            clienteNome={orcamento.clienteNome}
            orcamentoNumero={orcamento.numero}
            tipo="proposta"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
