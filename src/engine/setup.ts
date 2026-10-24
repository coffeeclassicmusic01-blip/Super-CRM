/**
 * Setup do engine: registra todos os comandos de negócio.
 * Chamado na inicialização da aplicação (main.tsx).
 */

import { Engine, createEngine } from './engine';
import {
  clientCommands,
  partnerCommands,
  quoteCommands,
  projectCommands,
  invoiceCommands,
  templateCommands,
  workflowCommands,
} from './commands';

export function setupEngine(estadoInicial?: any): Engine {
  const engine = createEngine(estadoInicial);

  for (const cmd of clientCommands()) engine.registrarComando(cmd);
  for (const cmd of partnerCommands()) engine.registrarComando(cmd);
  for (const cmd of quoteCommands()) engine.registrarComando(cmd);
  for (const cmd of projectCommands()) engine.registrarComando(cmd);
  for (const cmd of invoiceCommands()) engine.registrarComando(cmd);
  for (const cmd of templateCommands()) engine.registrarComando(cmd);
  for (const cmd of workflowCommands()) engine.registrarComando(cmd);

  return engine;
}

export type { Engine } from './engine';
