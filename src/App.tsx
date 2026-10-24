/**
 * CRM Super - Aplicação Principal
 * Arquitetura em camadas com controle de acesso e roteamento simples
 */

import { useState, useCallback, useEffect } from 'react';
import Dashboard from './routes/index';
import Clientes from './routes/clientes';
import Orcamentos from './routes/orcamentos';
import Parceiros from './routes/parceiros';
import Faturamento from './routes/faturamento';
import Projetos from './routes/projetos';
import Pagamentos from './routes/pagamentos';
import { ClientPage } from './features/clients/client-page';
import { ClienteDetalhe } from './features/clients/client-detail';
import { QuoteGenerator } from './features/quotes/quote-generator';
import { QuoteList } from './features/quotes/quote-list';
import { QuoteDetalhe } from './features/quotes/quote-detail';
import type { Quote } from './domain/quote';
import { PartnerPage } from './features/partners/partner-page';
import { ParceiroDetalhe } from './features/partners/partner-detail';
import { WorkflowBuilder } from './features/workflows/workflow-builder';
import WorkflowList from './features/workflows/workflow-list';
import { KanbanView } from './features/workflows/kanban-view';
import { CalendarView } from './features/workflows/calendar-view';
import { WorkflowPage } from './features/workflows/workflow-page';
import { CommunicationsPage } from './features/communications/communications-page';
import { CommunicationsInternal } from './features/communications-internal/communications-internal';
import { BackupPage } from './features/backup/backup-page';
import { Button } from '@/components/ui/button';
import { Login } from './features/auth/login';
import { AuditLogView } from './features/auth/audit-log-view';
import { MOCK_USUARIOS, temPermissao } from './features/auth/auth-types';

type RouteName =
  | 'dashboard'
  | 'clientes'
  | 'orcamentos'
  | 'orcamentos-novo'
  | 'orcamentos-detalhe'
  | 'parceiros'
  | 'faturamento'
  | 'projetos'
  | 'pagamentos'
  | 'workflows'
  | 'cliente-novo'
  | 'cliente-editar'
  | 'cliente-detalhe'
  | 'parceiro-novo'
  | 'parceiro-editar'
  | 'parceiro-detalhe'
  | 'workflows'
  | 'workflow-novo'
  | 'workflow-detalhe'
  | 'workflow-kanban'
  | 'workflow-calendario'
  | 'comunicacoes'
  | 'comunicacao-interna'
  | 'auditoria'
  | 'backups';

const routeComponents: Record<RouteName, React.ComponentType<any>> = {
  dashboard: Dashboard,
  clientes: Clientes,
  orcamentos: Orcamentos,
  'orcamentos-novo': QuoteGenerator,
  'orcamentos-detalhe': QuoteDetalhe,
  parceiros: Parceiros,
  faturamento: Faturamento,
  projetos: Projetos,
  pagamentos: Pagamentos,
  'cliente-novo': ClientPage,
  'cliente-editar': ClientPage,
  'cliente-detalhe': ClienteDetalhe,
  'parceiro-novo': PartnerPage,
  'parceiro-editar': PartnerPage,
  'parceiro-detalhe': ParceiroDetalhe,
  workflows: WorkflowList,
  'workflow-novo': WorkflowBuilder,
  'workflow-detalhe': WorkflowPage,
  'workflow-kanban': KanbanView,
  'workflow-calendario': CalendarView,
  'comunicacoes': CommunicationsPage,
  'comunicacao-interna': CommunicationsInternal,
  'auditoria': AuditLogView,
  'backups': BackupPage,
};

const routeLabels: Record<RouteName, string> = {
  dashboard: 'Visão geral',
  clientes: 'Clientes',
  orcamentos: 'Orçamentos',
  'orcamentos-novo': 'Novo orçamento',
  'orcamentos-detalhe': 'Detalhe do orçamento',
  parceiros: 'Parceiros',
  faturamento: 'Faturamento',
  projetos: 'Projetos',
  pagamentos: 'Pagamentos',
  'cliente-novo': 'Novo cliente',
  'cliente-editar': 'Editar cliente',
  'cliente-detalhe': 'Detalhe do cliente',
  'parceiro-novo': 'Novo parceiro',
  'parceiro-editar': 'Editar parceiro',
  'parceiro-detalhe': 'Detalhe do parceiro',
  workflows: 'Workflows',
  'workflow-novo': 'Novo workflow',
  'workflow-detalhe': 'Detalhe do workflow',
  'workflow-kanban': 'Kanban',
  'workflow-calendario': 'Calendário',
  'comunicacoes': 'Comunicação',
  'comunicacao-interna': 'Comunicação Interna',
  'auditoria': 'Auditoria',
  'backups': 'Backups',
};

type NavigationState = {
  route: RouteName;
  params: Record<string, any>;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [nav, setNav] = useState<NavigationState>({
    route: 'dashboard',
    params: {},
  });
  const [usuarioLogado, setUsuarioLogado] = useState<typeof MOCK_USUARIOS[number] | null>(null);

  // Inicializar tema
  useEffect(() => {
    const saved = localStorage.getItem('crm-super-tema');
    if (saved) {
      setDarkMode(saved === 'escuro');
      document.documentElement.classList.toggle('dark', saved === 'escuro');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Se não há usuário logado, mostrar tela de login
  if (!usuarioLogado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Login onLogin={(usuario) => {
            setUsuarioLogado(usuario);
            setNav({ route: 'dashboard', params: {} });
          }} />
        </div>
      </div>
    );
  }

  const navigateTo = useCallback((route: RouteName, params?: Record<string, unknown>) => {
    setNav({ route, params: params ?? {} });
  }, []);

  const logout = () => {
    setUsuarioLogado(null);
    setNav({ route: 'dashboard', params: {} });
  };

  const toggleTema = () => setDarkMode((d) => {
    const nd = !d;
    document.documentElement.classList.toggle('dark', nd);
    localStorage.setItem('crm-super-tema', nd ? 'escuro' : 'claro');
    return nd;
  });

  const label = routeLabels[nav.route];
  const params = nav.params;

  // Determinar conteúdo do main com base na rota
  let mainContent: React.ReactNode = <Dashboard />;

  if (nav.route === 'cliente-detalhe' && params.cliente) {
    mainContent = (
      <ClienteDetalhe
        cliente={params.cliente}
        onEditar={() => navigateTo('cliente-editar', { clienteId: params.cliente.id })}
        onVoltar={() => navigateTo('clientes')}
      />
    );
  } else if (nav.route === 'cliente-novo' || nav.route === 'cliente-editar') {
    mainContent = (
      <ClientPage
        modo={nav.route === 'cliente-novo' ? 'novo' : 'editar'}
        clienteId={params.clienteId}
        dadosIniciais={params.dadosIniciais}
        onSave={async (dados) => {
          console.log('Salvando cliente:', dados);
          navigateTo('clientes');
        }}
        onCancel={() => navigateTo('clientes')}
      />
    );
  } else if (nav.route === 'orcamentos') {
    mainContent = (
      <QuoteList
        orcamentos={[]}
        onNovo={() => navigateTo('orcamentos-novo')}
        onEditar={(id) => navigateTo('orcamentos-detalhe', { id })}
        onDetalhe={(id) => navigateTo('orcamentos-detalhe', { id })}
        onNovaRevisao={(id, motivo) => {
          console.log('Nova revisão:', id, motivo);
          navigateTo('orcamentos');
        }}
        onGerarLink={(id) => {
          console.log('Gerar link:', id);
        }}
      />
    );
  } else if (nav.route === 'orcamentos-novo') {
    mainContent = (
      <QuoteGenerator
        clientes={[]}
        templates={[]}
        onSave={async (dados) => {
          console.log('Salvando orçamento:', dados);
          navigateTo('orcamentos');
        }}
      />
    );
  } else if (nav.route === 'orcamentos-detalhe') {
    const orc: Quote[] = [];
    const found = orc.find((o) => o.id === params.id);
    if (found) {
      mainContent = (
        <QuoteDetalhe
          orcamento={found}
          onVoltar={() => navigateTo('orcamentos')}
          onEditar={() => navigateTo('orcamentos-novo')}
          onNovaRevisao={(motivo) => {
            console.log('Nova revisão:', motivo);
            navigateTo('orcamentos');
          }}
          onGerarLink={() => {
            console.log('Gerar link para:', found.id);
          }}
          onAprovar={(ip) => {
            console.log('Aprovar com IP:', ip);
            navigateTo('orcamentos');
          }}
          onGerarPreNota={() => {
            console.log('Gerar pré-nota para:', found.id);
          }}
        />
      );
    } else {
      mainContent = (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">Orçamento não encontrado.</p>
          <Button onClick={() => navigateTo('orcamentos')}>Voltar</Button>
        </div>
      );
    }
  } else if (nav.route === 'parceiro-detalhe' && params.parceiro) {
    mainContent = (
      <ParceiroDetalhe
        parceiro={params.parceiro}
        onEditar={() => navigateTo('parceiro-editar', { parceiroId: params.parceiro.id })}
        onVoltar={() => navigateTo('parceiros')}
        onDefinirComissao={(tipo, valor, aplicaSobre) => {
          console.log('Definir comissão:', tipo, valor, aplicaSobre);
          navigateTo('parceiros');
        }}
      />
    );
  } else if (nav.route === 'parceiro-novo' || nav.route === 'parceiro-editar') {
    mainContent = (
      <PartnerPage
        modo={nav.route === 'parceiro-novo' ? 'novo' : 'editar'}
        parceiroId={params.parceiroId}
        dadosIniciais={params.dadosIniciais}
        onSave={async (dados) => {
          console.log('Salvando parceiro:', dados);
          navigateTo('parceiros');
        }}
        onCancel={() => navigateTo('parceiros')}
      />
    );
  } else if (nav.route === 'workflows') {
    mainContent = (
      <WorkflowPage
        workflows={[]}
        workflowInstances={[]}
        onNovoWorkflow={() => navigateTo('workflow-novo')}
        onNovoWorkflowInstance={() => console.log('Nova instância de workflow')}
        onEditarWorkflow={(id) => navigateTo('workflow-detalhe', { id })}
        onVerKanban={() => {}}
        onVerCalendario={() => {}}
      />
    );
  } else if (nav.route === 'workflow-novo') {
    mainContent = (
      <WorkflowBuilder
        onSave={async (dados) => {
          console.log('Salvando workflow:', dados);
          navigateTo('workflows');
        }}
        onCancel={() => navigateTo('workflows')}
      />
    );
  } else if (nav.route === 'workflow-detalhe') {
    mainContent = (
      <WorkflowPage
        workflows={[]}
        workflowInstances={[]}
        onNovoWorkflow={() => navigateTo('workflow-novo')}
        onNovoWorkflowInstance={() => console.log('Nova instância')}
        onEditarWorkflow={() => navigateTo('workflow-novo')}
        onVerKanban={() => {}}
        onVerCalendario={() => {}}
      />
    );
  } else if (nav.route === 'comunicacoes') {
    mainContent = (
      <CommunicationsPage
        orcamento={{
          id: 'ORC-0001',
          numero: 'ORC-0001',
          clienteNome: 'Cliente Exemplo',
          clienteEmail: 'cliente@exemplo.com',
          telefone: '(11) 99999-9999',
          projeto: 'Projeto Exemplo',
          totalCents: 0,
          linkPublico: undefined,
        }}
        onEnviado={() => {
          console.log('Comunicação enviada');
          navigateTo('orcamentos');
        }}
      />
    );
  } else if (nav.route === 'comunicacao-interna') {
    mainContent = (
      <CommunicationsInternal
        usuarioId={usuarioLogado.id}
        onVoltar={() => navigateTo('dashboard')}
      />
    );
  } else if (nav.route === 'auditoria') {
    mainContent = (
      <AuditLogView />
    );
  } else if (nav.route === 'backups') {
    mainContent = (
      <BackupPage
        dados={{
          clientes: [],
          parceiros: [],
          orcamentos: [],
          projetos: [],
          pagamentos: [],
          faturas: [],
          workflows: [],
          workflowInstances: [],
          usuarios: MOCK_USUARIOS,
          auditoria: [],
          exportadoEm: new Date().toISOString(),
          versao: '1.0.0',
        }}
        onImportarDados={(dados) => {
          console.log('Dados importados:', dados);
          navigateTo('dashboard');
        }}
      />
    );
  } else {
    const Component = routeComponents[nav.route];
    mainContent = <Component />;
  }

  // Verificar se o usuário tem permissão para acessar a rota atual
  const podeAcessar = temPermissao(usuarioLogado, nav.route, 'ler');

  return (
    <div className="workspace h-full bg-slate-50 dark:bg-slate-950">
      {!podeAcessar && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
            🔒
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Acesso restrito
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Seu perfil ({usuarioLogado?.cargo}) não tem acesso a este módulo.
          </p>
          <Button onClick={() => navigateTo('dashboard')}>Voltar ao início</Button>
        </div>
      )}
      {podeAcessar && (
        <>
          <aside className="sidebar flex-shrink-0 z-20">
            <div className="px-3 py-2">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }}
                className="brand flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-2"
              >
                <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
                  CS
                </span>
                <span>CRM Super</span>
              </a>
            </div>

            <div className="p-1 space-y-0.5">
              {Object.entries(routeComponents).map(([key]) => {
                const rn = key as RouteName;
                const podeVer = temPermissao(usuarioLogado, rn, 'ler');
                if (!podeVer) return null;
                const isActive = nav.route === rn;
                return (
                  <button
                    key={rn}
                    onClick={() => navigateTo(rn)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    {routeLabels[rn]}
                  </button>
                );
              })}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Sair</span>
                  <span className="text-[10px]">({usuarioLogado.nome})</span>
                </button>
              </div>
            </div>

            <div className="mt-auto p-3 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={toggleTema}
                className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{darkMode ? 'Modo claro' : 'Modo escuro'}</span>
                {darkMode ? '☀' : '☾'}
              </button>
              <div className="text-xs text-slate-400 dark:text-slate-500 px-2">
                {usuarioLogado.nome} · {usuarioLogado.cargo}
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="topbar flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTema}
                  className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Alternar tema"
                >
                  {darkMode ? '☀' : '☾'}
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
              {mainContent}
            </main>
          </div>
        </>
      )}
    </div>
  );
}