# CRM Super — instruções para agentes

Este projeto é um CRM de gestão de clientes, parceiros de negócios, orçamentos, projetos, pagamentos e notas fiscais (espelho de pré-nota).

Inspirado nas boas práticas de [wordcraft](https://github.com/storytold/wordcraft), [gridcraft](https://github.com/storytold/gridcraft) e [GeoStudio](https://github.com/coffeeclassicmusic01-blip/GeoStudio).

## Comece sempre por aqui

1. Leia `plan/STATUS.md` (marco atual, próxima tarefa) e `plan/execution-plan.md`. Se `plan/` não existir, comece por `ROADMAP.md`.
2. Siga o protocolo de operação autônoma. Não pare para perguntar a menos que a decisão seja do proprietário (licenciamento, publicação, push para novos remotos, segredos).
3. `plan/` é gitignorado (apenas local).

## Nunca crash

Pessoas confiam no CRM com seus dados de negócio. **Isso está acima de qualquer feature:** nunca entregue uma feature por um caminho de pânico; corrija um crash antes de construir em cima dele.

- **Sem panics em código não-teste:** nenhum `panic!`, `unwrap()`, `expect()` (Rust) ou `throw new Error()` não capturado (TS). Use `Result` / try-catch com mensagens de erro claras.
- **Erros explícitos:** toda função que pode falhar retorna `Promise<T | { error: string }>` ou lança exceções tipadas.
- **Entrada hostil:** dados de usuário, arquivos, parâmetros de API e comandos MCP são considerados hostis. Valide com Zod antes de usar. Nunca acesse array por índice sem checar tamanho.
- **Último recurso:** o shell de comandos captura exceções escapadas e restaura o estado. É rede de segurança, não licença.

## Arquitetura em camadas

| Camada | Pasta | Responsabilidade |
|--------|-------|------------------|
| L0 Core | `src/core` | Tipos base, validação CPF/CNPJ, utilitários de dinheiro e data |
| L1 Domain | `src/domain` | Entidades de negócio (Cliente, Parceiro, Orçamento, Projeto, Pagamento, Fatura) |
| L2 Engine | `src/engine` | Command pattern, versionamento, regras de negócio, workflows |
| L3 Services | `src/services` | Email (SMTP), WhatsApp, Teams, PDF, backups na nuvem |
| L4 UI | `src/features/`, `src/components/` | React + shadcn/ui, views Tabela/Cards/Kanban, dark mode |
| L5 Apps | `src/main.tsx`, `src/routes/` | Ponto de entrada, rotas TanStack Router |

- **Tudo é um comando.** Cada ação visível ao usuário é um `Command` com `id`, `label`, `params`, `run()` e testes. Ribbon/atalhos/CLI/MCP disparam por id.
- **A UI é fina:** componentes leem o estado do engine e disparam comandos. Nada abaixo do L4 UI depende de React/DOM diretamente.
- **O UI é swappable:** o engine não conhece o React.

## Assets: iconografia original

- **Nunca copie ícones, imagens, templates ou temas da Microsoft, Adobe, Salesforce ou qualquer outro fornecedor.**
- Todo asset deve ser **original** (desenhado em código ou SVG próprio), **público domínio / CC0**, ou **open source** que permita redistribuição.
- Todo arquivo de asset tem uma linha em `ATTRIBUTION.md` (autor, fonte, licença). Adicione a linha no mesmo commit do arquivo.
- Fontes: use apenas fontes do sistema ou open source (ex. Inter, via Google Fonts). Nunca bundle fontes proprietárias.

## Boas práticas de código

- **TypeScript estrito:** `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- **Zod para validação:** todo dado de entrada (forms, API, MCP) é validado com esquemas Zod.
- **React Hook Forms:** todos os formulários usam `react-hook-form` + `zod resolver`.
- **TanStack Query:** toda chamada de serviço remoto usa `useQuery` / `useMutation`.
- **Dark mode:** alternar classe `dark` no `<html>`. Suporte a `prefers-color-scheme`.
- **Idioma:** português do Brasil (pt-BR). Moeda: BRL. Datas: ISO 8601 internamente, exibição `dd/MM/yyyy`.

## Testes

- **Vitest + Testing Library:** teste todos os comandos do engine, validadores Zod e componentes críticos.
- Todo corretivo de bug vem com teste de regressão.
- `npm test` deve passar antes de cada commit.

## Qualidade antes de cada commit

- `npm run lint` (ESLint + Prettier)
- `npm run format` (Prettier)
- `npm test` (Vitest)
- Commit com ID da tarefa na mensagem (`M1.1: cadastro de clientes`)

## Contribuição de agentes

- Agentes trabalham para contribuidores humanos. Nunca adicione, edite ou adivinhe o nome de outro contribuidor.
- Créditos em `src/features/ui/about/contributors.ts` (se aplicável).

## Soluções gratuitas apenas

Todas as dependências são open source (MIT, Apache-2.0, ISC ou similar). Nenhuma dependência paga ou proprietária.

## Tudo de forma lícita

- Não copie código GPL/AGPL/LGPL sem cumprir a licença correspondente.
- Use apenas recursos acessíveis publicamente e com licença compatível.
- Não colete dados pessoais sem consentimento. LGPD-compliant por design.
