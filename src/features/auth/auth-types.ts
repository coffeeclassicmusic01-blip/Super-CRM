/**
 * Tipos de Autenticação e Controle de Acesso (Módulo 9).
 * Níveis de permissão: Vendedor, Técnico, Financeiro, Designer, Admin.
 */

export type NivelPermissao = 'vendedor' | 'tecnico' | 'financeiro' | 'designer' | 'admin';

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  cargo: NivelPermissao;
  status: 'ativo' | 'inativo';
  avatar?: string;
  ultimoLogin?: string;
};

export type Permissao = {
  modulo: string;
  podeLer: boolean;
  podeGravar: boolean;
  podeExcluir: boolean;
  podeAprovar: boolean;
};

export type PermissoesPorNivel = Record<NivelPermissao, Permissao[]>;

export const PERMISSOES_PADRAO: PermissoesPorNivel = {
  vendedor: [
    { modulo: 'clientes', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
    { modulo: 'orcamentos', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
    { modulo: 'parceiros', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'projetos', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'faturamento', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'pagamentos', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'workflows', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'comunicacao', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
  ],
  tecnico: [
    { modulo: 'clientes', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'orcamentos', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'parceiros', podeLer: false, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'projetos', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
    { modulo: 'faturamento', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'pagamentos', podeLer: false, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'workflows', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
    { modulo: 'comunicacao', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
  ],
  financeiro: [
    { modulo: 'clientes', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'orcamentos', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: true },
    { modulo: 'parceiros', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'projetos', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'faturamento', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: true },
    { modulo: 'pagamentos', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: true },
    { modulo: 'workflows', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'comunicacao', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
  ],
  designer: [
    { modulo: 'clientes', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'orcamentos', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'parceiros', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'projetos', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'faturamento', podeLer: false, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'pagamentos', podeLer: false, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'workflows', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
    { modulo: 'comunicacao', podeLer: true, podeGravar: true, podeExcluir: false, podeAprovar: false },
  ],
  admin: [
    { modulo: 'clientes', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'orcamentos', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'parceiros', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'projetos', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'faturamento', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'pagamentos', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'workflows', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'comunicacao', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'usuarios', podeLer: true, podeGravar: true, podeExcluir: true, podeAprovar: true },
    { modulo: 'auditoria', podeLer: true, podeGravar: false, podeExcluir: false, podeAprovar: false },
  ],
};

export const nivelLabels: Record<NivelPermissao, string> = {
  vendedor: 'Vendedor',
  tecnico: 'Técnico',
  financeiro: 'Financeiro',
  designer: 'Designer',
  admin: 'Administrador',
};

export const nivelCores: Record<NivelPermissao, string> = {
  vendedor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  tecnico: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  financeiro: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  designer: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  admin: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
};

export const MOCK_USUARIOS: Usuario[] = [
  {
    id: 'USR-001',
    nome: 'Marina Costa',
    email: 'marina@crmsuper.example',
    cargo: 'admin',
    status: 'ativo',
    avatar: 'MC',
    ultimoLogin: new Date().toISOString(),
  },
  {
    id: 'USR-002',
    nome: 'Lucas Silva',
    email: 'lucas@crmsuper.example',
    cargo: 'vendedor',
    status: 'ativo',
    avatar: 'LS',
    ultimoLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'USR-003',
    nome: 'Pedro Alves',
    email: 'pedro@crmsuper.example',
    cargo: 'tecnico',
    status: 'ativo',
    avatar: 'PA',
    ultimoLogin: new Date().toISOString(),
  },
  {
    id: 'USR-004',
    nome: 'Ana Beatriz',
    email: 'ana@crmsuper.example',
    cargo: 'designer',
    status: 'ativo',
    avatar: 'AB',
    ultimoLogin: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'USR-005',
    nome: 'Roberto Lima',
    email: 'roberto@crmsuper.example',
    cargo: 'financeiro',
    status: 'ativo',
    avatar: 'RL',
    ultimoLogin: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

export function temPermissao(
  usuario: Usuario,
  modulo: string,
  acao: 'ler' | 'gravar' | 'excluir' | 'aprovar',
): boolean {
  const permissoes = PERMISSOES_PADRAO[usuario.cargo];
  if (!permissoes) return false;
  const permissao = permissoes.find((p) => p.modulo === modulo);
  if (!permissao) return false;
  switch (acao) {
    case 'ler': return permissao.podeLer;
    case 'gravar': return permissao.podeGravar;
    case 'excluir': return permissao.podeExcluir;
    case 'aprovar': return permissao.podeAprovar;
  }
}

export function podeAcessarModulo(usuario: Usuario, modulo: string): boolean {
  return temPermissao(usuario, modulo, 'ler');
}

export function podeGravarModulo(usuario: Usuario, modulo: string): boolean {
  return temPermissao(usuario, modulo, 'gravar');
}

export function podeExcluirModulo(usuario: Usuario, modulo: string): boolean {
  return temPermissao(usuario, modulo, 'excluir');
}

export function podeAprovarModulo(usuario: Usuario, modulo: string): boolean {
  return temPermissao(usuario, modulo, 'aprovar');
}
