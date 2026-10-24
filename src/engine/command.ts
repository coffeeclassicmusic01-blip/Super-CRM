/**
 * Command pattern - extraído de wordcraft/gridcraft.
 * Toda ação do usuário é um Command com id, label, params, run() e testes.
 * O engine executa comandos, mantém histórico e permite undo/redo.
 */

import { err, type Result } from '../core/result';

export type CommandParams = Record<string, unknown>;

export type CommandResult<T = unknown> = Result<T, string>;

export interface CommandSpec<
  P extends CommandParams = CommandParams,
  R = unknown,
> {
  id: string;
  label: string;
  categoria: string;
  descricao: string;
  validate: (params: P) => CommandResult<void>;
  run: (params: P, state: unknown) => CommandResult<R>;
  undoavel: boolean;
  abreDialog: boolean;
}

export interface CommandRegistry {
  registrar<P extends CommandParams, R>(spec: CommandSpec<P, R>): void;
  obter<P extends CommandParams, R>(
    id: string,
  ): CommandSpec<P, R> | undefined;
  listar(): CommandSpec[];
  executar<P extends CommandParams, R>(
    id: string,
    params: P,
    state: unknown,
  ): CommandResult<R>;
}

export class BasicCommandRegistry implements CommandRegistry {
  private comandos = new Map<string, CommandSpec<CommandParams, unknown>>();

  registrar<P extends CommandParams, R>(spec: CommandSpec<P, R>): void {
    if (this.comandos.has(spec.id)) {
      throw new Error(`Comando já registrado: ${spec.id}`);
    }
    this.comandos.set(
      spec.id,
      spec as CommandSpec<CommandParams, unknown>,
    );
  }

  obter<P extends CommandParams, R>(
    id: string,
  ): CommandSpec<P, R> | undefined {
    return this.comandos.get(id) as CommandSpec<P, R> | undefined;
  }

  listar(): CommandSpec[] {
    return Array.from(this.comandos.values());
  }

  executar<P extends CommandParams, R>(
    id: string,
    params: P,
    state: unknown,
  ): CommandResult<R> {
    const comando = this.comandos.get(id);
    if (!comando) {
      return err(`Comando não encontrado: ${id}`);
    }
    const validacao = comando.validate(params);
    if (!validacao.ok) {
      return err(validacao.error);
    }
    return comando.run(params, state) as CommandResult<R>;
  }
}
