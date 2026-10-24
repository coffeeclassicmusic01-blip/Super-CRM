/**
 * Linha de item dinâmica da tabela de preços (Módulo 2: Tabelas Dinâmicas de Preço com Fotos).
 */

import { useState } from 'react';
import { Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatMoneyBRL } from '@/core/money';

export interface QuoteItemForm {
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitarioCents: number;
  imagemUrl?: string;
  observacao?: string;
}

export interface QuoteItemRowProps {
  item: QuoteItemForm;
  index: number;
  onUpdate: (index: number, item: Partial<QuoteItemForm>) => void;
  onRemove: (index: number) => void;
  unidades?: string[];
}

export function QuoteItemRow({
  item,
  index,
  onUpdate,
  onRemove,
  unidades = ['UN', 'M', 'M²', 'M³', 'KG', 'L', 'CX', 'RL', 'PC'],
}: QuoteItemRowProps) {
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagemPreview(reader.result as string);
      onUpdate(index, { imagemUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const subTotal = item.quantidade * item.valorUnitarioCents;

  return (
    <div className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 mb-2">
      {/* Imagem do item */}
      <div className="relative shrink-0">
        {imagemPreview ? (
          <img src={imagemPreview} alt="Item" className="w-16 h-16 object-cover rounded-md" />
        ) : (
          <div className="w-16 h-16 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
            <Image size={16} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImagemChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
        <div className="md:col-span-4">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Descrição
          </label>
          <Input
            value={item.descricao}
            onChange={(e) => onUpdate(index, { descricao: e.target.value })}
            placeholder="Descrição do item"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Qtd
          </label>
          <Input
            type="number"
            value={item.quantidade}
            onChange={(e) =>
              onUpdate(index, { quantidade: Math.max(1, parseInt(e.target.value) || 1) })
            }
            className="text-right"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Unidade
          </label>
          <select
            value={item.unidade}
            onChange={(e) => onUpdate(index, { unidade: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {unidades.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Valor Unitário
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-500">R$</span>
            <Input
              type="number"
              value={item.valorUnitarioCents / 100}
              step="0.01"
              onChange={(e) =>
                onUpdate(index, {
                  valorUnitarioCents: Math.round(parseFloat(e.target.value) * 100) || 0,
                })
              }
              className="pl-8"
              placeholder="0,00"
            />
          </div>
        </div>
        <div className="md:col-span-1 flex items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="md:col-span-12 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
          Observação
        </label>
        <Input
          value={item.observacao ?? ''}
          onChange={(e) => onUpdate(index, { observacao: e.target.value })}
          placeholder="Observações sobre este item..."
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Subtotal: {formatMoneyBRL({ cents: subTotal })}
          </span>
        </div>
      </div>
    </div>
  );
}
