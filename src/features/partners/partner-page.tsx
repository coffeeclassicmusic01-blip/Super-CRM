/**
 * Página de Cadastro/Edição de Parceiro (Módulo 7: Parceiros & Comissões).
 */

import { useState } from 'react';
import { PartnerForm } from './partner-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

export interface PartnerPageProps {
  modo: 'novo' | 'editar';
  parceiroId?: string;
  dadosIniciais?: any;
  onSave: (dados: any) => Promise<void>;
  onCancel: () => void;
}

export function PartnerPage({ modo, dadosIniciais, onSave, onCancel }: PartnerPageProps) {
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
  const titulo = isNovo ? 'Novo Parceiro' : 'Editar Parceiro';
  const subtitulo = isNovo
    ? 'Cadastre um novo parceiro de negócios com regras de comissão.'
    : 'Atualize os dados do parceiro.';

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
          <Button
            variant="outline"
            onClick={onCancel}
          >
            <ArrowLeft size={18} /> Voltar
          </Button>
          <Button
            disabled={salvando}
          >
            <Save size={18} /> {salvando ? 'Salvando...' : 'Salvar parceiro'}
          </Button>
        </div>
      </div>

      <PartnerForm
        dadosIniciais={dadosIniciais}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
}
