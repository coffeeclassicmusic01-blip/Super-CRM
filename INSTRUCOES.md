# CRM Super - Guia de Instalação e Uso

## Pré-requisitos

Antes de começar, você precisa ter o **Node.js** instalado em seu computador.

- Baixe e instale em: https://nodejs.org/
- Versão recomendada: Node.js 18 ou superior

---

## Como Instalar (Passo a Passo)

### Opção 1: Usando o Script Automático (Recomendado)

**Windows:**
1. Dê um duplo clique no arquivo `instalar.bat`
2. Aguarde a instalação completar

**Linux/Mac:**
1. Dê permissão de execução: `chmod +x instalar.sh`
2. Execute: `./instalar.sh`

### Opção 2: Instalação Manual

```bash
# 1. Instalar dependências
npm install --legacy-peer-deps

# 2. Iniciar o servidor de desenvolvimento
npm run dev
```

---

## Como Acessar o Sistema

1. Após instalar, execute: `npm run dev`
2. O terminal mostrará algo como: `http://localhost:5173`
3. Abra esse endereço no seu navegador
4. Faça login com:

### Usuários Disponíveis:

| Usuário | E-mail | Senha | Cargo |
|---------|--------|-------|-------|
| Marina Costa | marina@crmsuper.example | 123456 | Administrador |
| Lucas Silva | lucas@crmsuper.example | 123456 | Vendedor |
| Pedro Alves | pedro@crmsuper.example | 123456 | Técnico |
| Ana Beatriz | ana@crmsuper.example | 123456 | Designer |
| Roberto Lima | roberto@crmsuper.example | 123456 | Financeiro |

---

## Módulos Disponíveis

| Módulo | Descrição |
|--------|-----------|
| Dashboard | Visão geral com métricas e ações rápidas |
| Clientes | Cadastro PF/PJ, contatos, endereços |
| Orçamentos | Criação, versionamento, preview de propostas |
| Parceiros | Cadastro e regras de comissão |
| Faturamento | Espelho de pré-nota fiscal |
| Projetos | Acompanhamento com Kanban |
| Pagamentos | Controle de pagamentos e parcelas |
| Workflows | Construtor de fluxos personalizados |
| Comunicação | Envio por e-mail (SMTP) e WhatsApp |
| Comunicação Interna | Canais, Kanban, calendário de equipes |
| Controle de Acesso | Níveis de permissão (Admin, Vendedor, Técnico, Designer, Financeiro) |
| Auditoria | Log de auditoria de todas as ações |
| Backups | Backup automático e manual |

---

## Solução de Problemas

### Erro ao instalar dependências:

Tente executar:
```bash
npm install --legacy-peer-deps
```

### O projeto não abre:

Verifique se o servidor está rodando:
```bash
npm run dev
```
Depois acesse `http://localhost:5173` no navegador.

---

## Estrutura do Projeto

```
CRM_Super-00/
├── src/
│   ├── core/              # Tipos base (Result, Money, ID, Date, CPF/CNPJ)
│   ├── domain/            # Entidades de negócio
│   ├── engine/            # Command pattern
│   ├── features/          # Módulos do sistema
│   │   ├── clients/       # Módulo 5 - Clientes
│   │   ├── quotes/        # Módulo 2,4,6 - Orçamentos
│   │   ├── partners/      # Módulo 7 - Parceiros
│   │   ├── workflows/     # Módulo 3 - Workflows/Kanban
│   │   ├── communications/ # Módulo 8 - Email/WhatsApp
│   │   ├── communications-internal/ # Módulo 9 - Comunicação interna
│   │   ├── backup/        # Módulo 10 - Backups
│   │   └── auth/          # Módulo 9 - Controle de Acesso
│   └── components/ui/     # Componentes UI (shadcn/ui)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── eslint.config.js
├── .prettierrc
├── AGENTS.md
├── ROADMAP.md
├── ATTRIBUTION.md
├── instalar.bat           # Script Windows
├── instalar.sh            # Script Linux/Mac
└── INSTRUCOES.md          # Este arquivo
```

---

## Tecnologias Utilizadas

- **React 18** - Interface do usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **React Hook Form + Zod** - Formulários e validação
- **TanStack Router** - Roteamento
- **Lucide React** - Ícones

---

## Solução de Problemas Comuns

| Problema | Solução |
|----------|---------|
| Erro ao instalar dependências | Use `npm install --legacy-peer-deps` |
| Página em branco | Verifique se fez login corretamente |
| Erro de permissão | Verifique se seu usuário tem permissão para o módulo |
| Erro de build | Execute `npm run build` novamente |

---

## Suporte

Se encontrar algum problema, entre em contato pelo e-mail: suporte@crmsuper.example

---

© 2026 CRM Super - Todos os direitos reservados