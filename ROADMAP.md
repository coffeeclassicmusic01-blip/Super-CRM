# Roadmap — CRM Super

## Status atual
Projeto em fase de configuração inicial. Arquitetura baseada nas boas práticas de:
- [wordcraft](https://github.com/storytold/wordcraft) — command pattern, never-crash, arquitetura em camadas, dark mode
- [gridcraft](https://github.com/storytold/gridcraft) — engine-first, tudo é comando, UI swappable
- [GeoStudio](https://github.com/coffeeclassicmusic01-blip/GeoStudio) — React + TanStack Router, cadastro clientes/parceiros, orçamentos com revisões, notas fiscais, PDF

## Marcos (M1–M10)

### M1: Configuração e base do projeto
- [x] Estrutura de pastas (L0-L5)
- [x] AGENTS.md com boas práticas
- [x] Camada L0 Core (Result, Money, ID, Date)
- [x] Camada L1 Domain (Clientes, Parceiros, Orçamentos, Projetos, Pagamentos, Faturas)
- [x] Camada L2 Engine (Command pattern, Registry, History/Undo)
- [x] Camada L3 Services (Email SMTP, WhatsApp wa.me, Teams webhook, PDF jsPDF, Backups)
- [x] Camada L4 UI (React + TanStack Router + Tailwind + shadcn/ui)
- [x] Páginas: Dashboard, Clientes, Orçamentos, Parceiros, Faturamento, Projetos, Pagamentos, Workflows

### M2: Módulo 5 — CRM & Gestão de Clientes
- [x] Cadastro PF/PJ com validação CPF/CNPJ
- [x] Contatos e endereços por cliente
- [x] Campos customizados por cliente
- [x] Histórico unificado de interações
- [x] Página de cadastro/edição (React Hook Form + Zod)
- [x] Página de detalhe com métricas, orçamentos e interações
- [x] Listagem com visualização Tabela/Cards e busca

### M3: Módulo 2 — Gerador de Propostas
- [x] Templates reutilizáveis por tipo de serviço/produto
- [x] Preenchimento guiado de parâmetros fiscais (validade, pagamento, entrega, garantia)
- [x] Preview em tempo real (Split View)
- [x] Tabelas dinâmicas de preço com fotos e colunas personalizadas

### M4: Módulo 6 — Orçamentos, Revisões & Espelho de Pré-Nota
- [x] Versionamento de orçamentos (v1, v2, v3) com Log de Motivos
- [x] Espelho de Pré-Nota Faturável (cópia rápida para Conta Azul)
- [x] Validade da Proposta & Alertas Automáticos de Vencimento
- [x] Link público interativo da proposta
- [x] Registro de aceite digital (IP, data, hora)

### M5: Módulo 7 — Parceiros & Comissões
- [x] Cadastro de parceiros (PF/PJ com validação CPF/CNPJ)
- [x] Regras de comissão (percentual ou fixo, aplica sobre valor total/lucro/primeira parcela)
- [x] Extrato de participação e comissões acumuladas/a pagar
- [x] Tabela de propostas com participação do parceiro
- [x] Página de detalhe com métricas de comissão

### M6: Módulo 3 — Construtor de Fluxos & Etapas
- [x] Workflows do zero com etapas ilimitadas
- [x] Reordenação visual (drag-and-drop)
- [ ] Definição de responsáveis, anexos obrigatórios e prazos por etapa
- [x] Visão Kanban dinâmica configurada por fluxo
- [x] Calendário de agendamentos (visitas, medições, instalações)
- [x] Instâncias de workflow vinculadas a projetos/clientes
- [ ] Conclusão de etapas e avanço automático do fluxo

### M7: Módulo 4 — Aceite Digital & Notificações
- [ ] Link público interativo da proposta
- [ ] Botão "Aprovar Proposta" com IP/data/hora
- [ ] Disparo automático de alerta no Teams interno

### M8: Módulo 8 — Comunicação Externa
- [x] Configuração SMTP (Gmail, Hotmail, Outlook, genérico)
- [x] Envio de propostas por e-mail com link público
- [x] Envio via WhatsApp (links wa.me gratuitos, sem API paga)
- [x] Confirmação de agendamentos (visita, medição, instalação)
- [x] Interface unificada com abas (E-mail / WhatsApp)

### M9: Módulo 9 — Controle de Acesso, Auditoria e Mural de Comentários
- [x] Controle de acesso com níveis de permissão (Vendedor, Técnico, Financeiro, Designer, Admin)
- [ ] Mural de comentários no pedido/orçamento
- [x] Sistema de login e autenticação de usuários
- [x] Audit Log (histórico de alterações)
- [x] Indicador de status do usuário (Online, Ausente, Em Reunião, Offline)
- [x] Notificações e menções (@usuário, #pedido)

### M10: Módulo 10 — Controle de Acesso, Auditoria e Backups
- [x] Configuração SMTP (Gmail, Hotmail, Outlook, genérico)
- [x] Envio de propostas por e-mail com link público
- [x] Envio via WhatsApp (links wa.me gratuitos, sem API paga)
- [x] Confirmação de agendamentos (visita, medição, instalação)
- [x] Interface unificada com abas (E-mail / WhatsApp)
- [x] Backups automáticos (IndexedDB/localStorage)
- [x] Exportação manual (JSON)
- [x] Importação de backups
- [x] Agendamento de backups automáticos
- [x] Histórico de backups

## Qualidade
- TypeScript estrito (`strict: true`)
- Zod para validação de entrada
- Vitest + Testing Library para testes
- ESLint + Prettier antes de cada commit
- Nenhuma dependência paga
