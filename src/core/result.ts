/**
 * Result<T, E> - padrão extraído de wordcraft/gridcraft (L0).
 * Evita exceções não capturadas em camadas de domínio e engine.
 * Toda operação que pode falhar retorna Result em vez de lançar.
 */

export type Ok<T> = { ok: true; value: T };
export type Err<E = string> = { ok: false; error: E };
export type Result<T, E = string> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

export function err<E = string>(error: E): Err<E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok === true;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.ok === false;
}

export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

/**
 * Wrapper async para funções que podem lançar. Converte exceções em Err.
 */
export async function safe<T>(
  fn: () => T | Promise<T>,
  onError: (e: unknown) => string = (e) => String(e ?? 'Erro desconhecido'),
): Promise<Result<T>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (e) {
    return err(onError(e));
  }
}

/**
 * Wrapper síncrono para funções que podem lançar.
 */
export function safeSync<T>(
  fn: () => T,
  onError: (e: unknown) => string = (e) => String(e ?? 'Erro desconhecido'),
): Result<T> {
  try {
    const value = fn();
    return ok(value);
  } catch (e) {
    return err(onError(e));
  }
}
