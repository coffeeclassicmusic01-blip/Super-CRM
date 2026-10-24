/**
 * Envio por WhatsApp (Módulo 8: Comunicação Externa & Envio).
 * Gera links wa.me para envio de propostas e confirmações de agendamento.
 * Solução gratuita: não requer API paga, usa links diretos do WhatsApp.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Phone,
  Copy,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { whatsAppService } from '@/services/whatsapp.service';

export interface WhatsAppSendProps {
  telefone: string;
  clienteNome: string;
  orcamentoNumero: string;
  tipo: 'proposta' | 'agendamento';
  dataAgendamento?: string;
  tipoAgendamento?: 'visita' | 'medicao' | 'instalacao';
}

export function WhatsAppSend({
  telefone,
  clienteNome,
  orcamentoNumero,
  tipo,
  dataAgendamento,
  tipoAgendamento,
}: WhatsAppSendProps) {
  const [link, setLink] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  if (!link) {
    if (tipo === 'proposta') {
      whatsAppService.enviarProposta(
        telefone,
        orcamentoNumero,
        '',
      ).then((resultado) => {
        if (resultado.sucesso && resultado.url) {
          setLink(resultado.url);
        }
      });
    } else if (tipo === 'agendamento' && dataAgendamento && tipoAgendamento) {
      whatsAppService.enviarConfirmacaoAgendamento(
        telefone,
        clienteNome,
        dataAgendamento,
        tipoAgendamento,
      ).then((resultado) => {
        if (resultado.sucesso && resultado.url) {
          setLink(resultado.url);
        }
      });
    }
  }

  if (enviado) {
    return (
      <Card className="border-green-200 dark:bg-green-900/20 border-green-900/20 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                Link do WhatsApp gerado!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Clique no botão abaixo para abrir o WhatsApp e enviar a mensagem.
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
          <Phone size={20} className="text-green-600 dark:text-green-400" />
          <CardTitle>
            {tipo === 'proposta' ? 'Enviar Proposta por WhatsApp' : 'Confirmar Agendamento'}
          </CardTitle>
        </div>
        <CardDescription>
          Gere um link do WhatsApp para enviar a proposta ou confirmação ao cliente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Telefone*</Label>
            <Input
              value={telefone}
              onChange={() => {}}
              placeholder="(11) 90000-0000"
              className="font-mono text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <Label>Cliente</Label>
            <Input value={clienteNome} disabled className="bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        {link ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Link gerado
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  setEnviado(true);
                }}
              >
                <Copy size={16} /> Copiar
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono text-blue-600 dark:text-blue-400 break-all">
              {link}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-sm text-blue-600 dark:text-blue-400 underline"
                >
                  <ExternalLink size={16} /> Abrir no WhatsApp
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            Gerando link do WhatsApp...
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={() => setEnviado(true)}
            disabled={!link}
          >
            Concluído
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
