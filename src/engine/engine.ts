/**
 * Engine central - estado da aplicação e execução de comandos.
 * Extração dos padrões de wordcraft/gridcraft (Session, undo, command registry).
 * UI não conhece o Engine diretamente; lê estado e dispara comandos.
 */
import { ok, err } from '../core/result';
import type {
  CommandSpec,
  CommandRegistry,
} from './command';
import type { CommandResult } from './command';
import type { Client } from '../domain/client';
import type { Partner } from '../domain/partner';
import type { Quote } from '../domain/quote';
import type { Project } from '../domain/project';
import type { Payment } from '../domain/payment';
import type { Invoice } from '../domain/invoice';
import { BasicCommandRegistry } from './command';

export type EngineState = {
  clientes: Client[];
  parceiros: Partner[];
  orcamentos: Quote[];
  projetos: Project[];
  pagamentos: Payment[];
  faturas: Invoice[];
  usuarioLogado: string;
  tema: 'claro' | 'escuro';
  view: 'tabela' | 'cards' | 'kanban';
  versao: number;
};

export type HistoryEntry = {
  comandoId: string;
  params: unknown;
  timestamp: string;
  estadoAnterior: unknown;
};

export class Engine {
  private state: EngineState;
  private registry: CommandRegistry;
  private history: HistoryEntry[] = [];
  private maxHistory = 500;

  constructor(
    estadoInicial: Partial<EngineState>,
    registry: CommandRegistry,
  ) {
    this.state = {
      clientes: [],
      parceiros: [],
      orcamentos: [],
      projetos: [],
      pagamentos: [],
      faturas: [],
      usuarioLogado: 'sistema',
      tema: 'claro',
      view: 'tabela',
      versao: 1,
      ...estadoInicial,
    };
    this.registry = registry;
  }

  getState(): EngineState {
    return this.state;
  }

  registrarComando<P extends Record<string, unknown>, R>(
    spec: CommandSpec<P, R>,
  ): void {
    this.registry.registrar(spec);
  }

  executar<P extends Record<string, unknown>, R>(
    id: string,
    params: P,
  ): CommandResult<R> {
    const comando = this.registry.obter(id);
    if (!comando) {
      return err(`Comando não encontrado: ${id}`);
    }

    const validacao = comando.validate(params);
    if (!validacao.ok) {
      return err(validacao.error);
    }

    const estadoAnterior = JSON.parse(JSON.stringify(this.state));

    const resultado = comando.run(params, this.state) as CommandResult<R>;

    if (resultado.ok && comando.undoavel) {
      this.history.push({
        comandoId: id,
        params,
        timestamp: new Date().toISOString(),
        estadoAnterior,
      });
      if (this.history.length > this.maxHistory) {
        this.history = this.history.slice(-this.maxHistory);
      }
    }

    return resultado;
  }

  desfazer(): CommandResult<void> {
    const ultimo = this.history.pop();
    if (!ultimo) {
      return err('Nada para desfazer');
    }
    this.state = ultimo.estadoAnterior as EngineState;
    return ok(undefined);
  }

  listarComandos() {
    return this.registry.listar();
  }

  definirTema(tema: 'claro' | 'escuro'): CommandResult<void> {
    this.state = { ...this.state, tema };
    return ok(undefined);
  }

  definirView(view: 'tabela' | 'cards' | 'kanban'): CommandResult<void> {
    this.state = { ...this.state, view };
    return ok(undefined);
  }

  getAuditLog(): HistoryEntry[] {
    return [...this.history].reverse();
  }
}

export function createEngine(
  estadoInicial?: Partial<EngineState>,
  registry?: CommandRegistry,
): Engine {
  const reg = registry ?? new BasicCommandRegistry();
  return new Engine(estadoInicial ?? {}, reg);
}
