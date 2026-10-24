/**
 * Tipos de Comunicação Interna (Módulo 9: Comunicação Interna - Estilo Teams).
 * Canais, mensagens diretas, status de usuário e menções.
 */

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export type User = {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  status: UserStatus;
  avatar?: string;
  ultimoVisto?: string;
};

export type Channel = {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'canal' | 'dm'; // canal = público por setor/projeto, dm = mensagem direta
  membros: string[]; // ids de usuários
  criadoEm: string;
  criadoPor: string;
};

export type Message = {
  id: string;
  canalId: string;
  autorId: string;
  autorNome: string;
  texto: string;
  mencoes: string[]; // ids de usuários mencionados (@usuario)
  referencias: string[]; // referências a pedidos (#pedido)
  anexos: string[]; // urls de anexos
  criadoEm: string;
  editadoEm?: string;
  respondendoA?: string; // id da mensagem respondida (thread)
};

export type Notification = {
  id: string;
  usuarioId: string;
  tipo: 'mençao' | 'resposta' | 'sistema' | 'pedido';
  texto: string;
  lida: boolean;
  criadoEm: string;
  link?: string;
};

export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    nome: 'Marina Costa',
    email: 'marina@crmsuper.example',
    cargo: 'Administradora',
    status: 'online',
    avatar: 'MC',
    ultimoVisto: new Date().toISOString(),
  },
  {
    id: 'USR-002',
    nome: 'Lucas Silva',
    email: 'lucas@crmsuper.example',
    cargo: 'Vendedor',
    status: 'away',
    avatar: 'LS',
    ultimoVisto: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'USR-003',
    nome: 'Pedro Alves',
    email: 'pedro@crmsuper.example',
    cargo: 'Técnico',
    status: 'busy',
    avatar: 'PA',
    ultimoVisto: new Date().toISOString(),
  },
  {
    id: 'USR-004',
    nome: 'Ana Beatriz',
    email: 'ana@crmsuper.example',
    cargo: 'Designer',
    status: 'offline',
    avatar: 'AB',
    ultimoVisto: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_CHANNELS: Channel[] = [
  {
    id: 'CH-001',
    nome: 'Vendas',
    descricao: 'Canal do setor de vendas - negociações e propostas',
    tipo: 'canal',
    membros: ['USR-001', 'USR-002'],
    criadoEm: '2026-10-01T00:00:00Z',
    criadoPor: 'USR-001',
  },
  {
    id: 'CH-002',
    nome: 'Técnico',
    descricao: 'Equipe técnica - instalações e medições',
    tipo: 'canal',
    membros: ['USR-001', 'USR-003'],
    criadoEm: '2026-10-01T00:00:00Z',
    criadoPor: 'USR-001',
  },
  {
    id: 'CH-003',
    nome: 'Projeto Nexum',
    descricao: 'Canal específico do projeto Redesign de plataforma digital',
    tipo: 'canal',
    membros: ['USR-001', 'USR-002', 'USR-003'],
    criadoEm: '2026-10-05T00:00:00Z',
    criadoPor: 'USR-001',
  },
  {
    id: 'CH-004',
    nome: 'Marina Costa (DM)',
    descricao: 'Mensagem direta com Marina Costa',
    tipo: 'dm',
    membros: ['USR-002', 'USR-001'],
    criadoEm: '2026-10-01T00:00:00Z',
    criadoPor: 'USR-002',
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'MSG-001',
    canalId: 'CH-001',
    autorId: 'USR-001',
    autorNome: 'Marina Costa',
    texto: 'Bom dia, equipe! A proposta ORC-2026-0001 foi enviada para o cliente.',
    mencoes: [],
    referencias: ['ORC-2026-0001'],
    anexos: [],
    criadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'MSG-002',
    canalId: 'CH-001',
    autorId: 'USR-002',
    autorNome: 'Lucas Silva',
    texto: 'Obrigado, Marina. Já avisei o cliente sobre a revisão.',
    mencoes: ['USR-001'],
    referencias: ['ORC-2026-0001'],
    anexos: [],
    criadoEm: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'MSG-003',
    canalId: 'CH-003',
    autorId: 'USR-003',
    autorNome: 'Pedro Alves',
    texto: 'A visita técnica está agendada para amanhã às 10h.',
    mencoes: [],
    referencias: [],
    anexos: [],
    criadoEm: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'MSG-004',
    canalId: 'CH-003',
    autorId: 'USR-001',
    autorNome: 'Marina Costa',
    texto: '@Lucas Silva, você pode acompanhar a instalação? #ORC-2026-0001',
    mencoes: ['USR-002'],
    referencias: ['ORC-2026-0001'],
    anexos: [],
    criadoEm: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    usuarioId: 'USR-001',
    tipo: 'mençao',
    texto: 'Lucas Silva mencionou você em #ORC-2026-0001',
    lida: false,
    criadoEm: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    link: '/orcamentos/ORC-2026-0001',
  },
  {
    id: 'NOT-002',
    usuarioId: 'USR-002',
    tipo: 'pedido',
    texto: 'Novo orçamento ORC-2026-0002 criado para Studio Forma',
    lida: true,
    criadoEm: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    link: '/orcamentos/ORC-2026-0002',
  },
];

export const statusLabel: Record<UserStatus, string> = {
  online: 'Online',
  away: 'Ausente',
  busy: 'Em reunião',
  offline: 'Offline',
};

export const statusColor: Record<UserStatus, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
  offline: 'bg-slate-400',
};

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getUserInitials(nome: string): string {
  return nome
    .split(' ')
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join('');
}
