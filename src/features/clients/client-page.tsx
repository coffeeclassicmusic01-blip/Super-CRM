/**
 * Página de Cadastro/Edição de Cliente (Módulo 5).
 * Navegação integrada com o App.tsx (roteamento manual, compatível com Lovable).
 */

import { useState } from 'react';
import { ClientForm } from './client-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

export interface ClientPageProps {
  modo: 'novo' | 'editar';
  clienteId?: string;
  dadosIniciais?: any;
  onSave: (dados: any) => Promise<void>;
  onCancel: () => void;
}

export function ClientPage({ modo, dadosIniciais, onSave, onCancel }: ClientPageProps) {
  const [salvando, setSalvando] = useState(false);

  async function handleSave(dados: any) {
    setSalvando(true);
    try {
      await onSave(dados);
    } finally {
      setSalvando(false);
    }
  }

  const isNovo = modo === 'novo';
  const titulo = isNovo ? 'Novo Cliente' : 'Editar Cliente';
  const subtitulo = isNovo
    ? 'Cadastre um novo cliente no sistema (Pessoa Física ou Jurídica).'
    : 'Atualize os dados do cliente.';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {titulo}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{subtitulo}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft size={18} /> Voltar
          </Button>
          <Button disabled={salvando}>
            <Save size={18} /> {salvando ? 'Salvando...' : 'Salvar cliente'}
          </Button>
        </div>
      </div>

      <ClientForm
        dadosIniciais={dadosIniciais}
        modoEdicao={!isNovo}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
}
