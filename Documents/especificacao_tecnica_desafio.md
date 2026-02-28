# Especificação Técnica — Desafio Frontend React (Sistema de Eventos / Painel do Organizador)

> Documento de especificação técnica para orientar a implementação do desafio.  
> Escopo: autenticação, rotas protegidas, dashboard, CRUD de eventos e participantes e tela de **Configuração de Check-in** com estado/validações avançadas.

---

## 1. Visão geral

A aplicação é um painel web para organizadores de eventos, com autenticação JWT e gerenciamento de **eventos**, **participantes** e **regras de check-in** (ponto central do desafio).

### 1.1 Objetivos técnicos
- Arquitetura organizada e escalável
- Autenticação via JWT com rotas protegidas
- Manipulação de estado complexo (principalmente em Regras de Check-in)
- Boas práticas: componentização, hooks, separação de responsabilidades, responsividade e UX

---

## 2. Stack recomendada

### 2.1 Base
- React 18+
- TypeScript (recomendado)
- Vite (build rápido e simples)

### 2.2 Roteamento e dados
- React Router (rotas e proteção)
- TanStack Query (React Query) para cache, refetch, loading/error states, mutations e otimista
- Axios ou Fetch (com camada de API)

### 2.3 Formulários e validação
- React Hook Form
- Zod (schemas e validação consistente)

### 2.4 UI / Estilo
Escolher 1:
- TailwindCSS + componentes próprios
- MUI (Material UI)
- Chakra UI

### 2.5 Qualidade
- ESLint + Prettier
- Conventional Commits
- Testes: Jest + Testing Library

### 2.6 Mock de API (quando não houver backend real)
Escolher 1:
- MSW (Mock Service Worker) **(preferido)**
- MirageJS
- JSON Server
- Mocks locais (somente para o mínimo)

---

## 3. Arquitetura e padrões

### 3.1 Princípios
- Separação clara entre: UI (components), páginas (routes), domínio (models/validation), dados (api/services), estado (stores/reducers)
- Acesso à API isolado em `src/services/api`
- Componentes reutilizáveis em `src/components`
- Páginas de rota em `src/pages`
- Validações e modelos no domínio em `src/domain`

### 3.2 Estrutura de pastas (sugestão)
```
src/
  app/
    router.tsx
    providers/
      AuthProvider.tsx
      QueryProvider.tsx
  components/
    layout/
      AppShell/
      Sidebar/
      Topbar/
    ui/
      Button/
      Input/
      Modal/
      Table/
      EmptyState/
      Loading/
      Toast/
  domain/
    auth/
      auth.schema.ts
      auth.types.ts
    events/
      event.schema.ts
      event.types.ts
    participants/
      participant.schema.ts
      participant.types.ts
    checkin/
      checkin.schema.ts
      checkin.types.ts
      checkin.validation.ts
  pages/
    Login/
    Dashboard/
    Events/
      EventsList/
      EventForm/
      EventDetails/
      CheckinRules/
    Participants/
      ParticipantsList/
      ParticipantForm/
  services/
    api/
      http.ts
      endpoints.ts
    auth.service.ts
    events.service.ts
    participants.service.ts
    dashboard.service.ts
    checkin.service.ts
  state/
    auth.store.ts
    checkin.reducer.ts
    checkin.selectors.ts
  utils/
    storage.ts
    dates.ts
    guards.ts
  styles/
    globals.css
```

---

## 4. Modelo de dados (contratos internos)

> Os contratos abaixo representam a forma como o frontend trabalha. O backend real/mock pode variar, mas deve respeitar o necessário para a UI.

### 4.1 Auth
```ts
type LoginRequest = { email: string; password: string };
type LoginResponse = { token: string };

type AuthUser = {
  email: string;
  name?: string;
};
```

### 4.2 Evento
```ts
type EventStatus = "ATIVO" | "ENCERRADO";

type Event = {
  id: string;
  nome: string;
  dataHora: string;   // ISO 8601
  local: string;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
};
```

### 4.3 Participante
```ts
type CheckinStatus = "FEITO" | "NAO_FEITO";

type Participant = {
  id: string;
  nome: string;
  email: string;
  eventoId: string;
  checkin: CheckinStatus;
  createdAt?: string;
  updatedAt?: string;
};
```

### 4.4 Regra de check-in
```ts
type RuleRequired = "OBRIGATORIO" | "OPCIONAL";

type CheckinRule = {
  id: string;
  nome: string;                 // ex.: "QR Code"
  ativo: boolean;
  obrigatoriedade: RuleRequired;
  liberarMinAntes: number;      // X minutos antes
  encerrarMinDepois: number;    // Y minutos depois
};
```

---

## 5. Contrato de API (mínimo necessário)

> O desafio permite API real ou mock. Abaixo estão os endpoints sugeridos, com payloads esperados pelo frontend.

### 5.1 Auth
- `POST /auth/login`
  - request: `{ email, password }`
  - response: `{ token }`

### 5.2 Dashboard
- `GET /dashboard`
  - response (exemplo):
  ```json
  {
    "totalEventos": 12,
    "totalParticipantes": 384,
    "proximosEventos": [
      { "id": "evt_1", "nome": "Expo Tech", "dataHora": "2026-03-01T18:00:00Z" }
    ],
    "ultimasAtividades": [
      { "tipo": "CHECKIN", "participante": "Ana", "evento": "Expo Tech", "em": "2026-02-27T13:10:00Z" }
    ]
  }
  ```

### 5.3 Eventos (CRUD)
- `GET /eventos?search=&status=&from=&to=&local=`
- `POST /eventos`
- `PUT /eventos/:id`
- `DELETE /eventos/:id`

### 5.4 Participantes (CRUD)
- `GET /participantes?search=&eventoId=&checkin=`
- `POST /participantes`
- `PUT /participantes/:id`
- `DELETE /participantes/:id`
- (opcional) `POST /participantes/:id/transferir` com `{ novoEventoId }`
  - Alternativa: transferir via `PUT /participantes/:id` alterando `eventoId`.

### 5.5 Regras de check-in por evento
- `GET /eventos/:id/regras-checkin`
- `PUT /eventos/:id/regras-checkin`
  - request: `{ regras: CheckinRule[] }`
  - response: `{ regras: CheckinRule[] }`

### 5.6 Headers e erro
- Toda rota autenticada deve enviar: `Authorization: Bearer <token>`
- Erros padronizados (mock):
  ```json
  { "message": "Credenciais inválidas", "code": "AUTH_INVALID" }
  ```

---

## 6. Autenticação e rotas protegidas

### 6.1 Armazenamento de token
- Persistência: `localStorage` (simples para desafio)
- Chave: `@events.token`
- Ao carregar o app: validar existência do token e carregar estado auth

### 6.2 Proteção de rotas
- Guard/Wrapper `RequireAuth`
  - Se não autenticado: redirect para `/login`
  - Se token expirado/401: limpar token e redirect

### 6.3 Logout
- Limpar storage e estado global
- Redirecionar para `/login`

---

## 7. Roteamento (sugestão)

```
/login
/dashboard
/eventos
/eventos/novo
/eventos/:id
/eventos/:id/editar
/eventos/:id/regras-checkin
/participantes
/participantes/novo
/participantes/:id/editar
```

---

## 8. Especificação por tela

## 8.1 Login
- Campos: e-mail e senha
- Submit -> `POST /auth/login`
- Sucesso: salvar token e navegar para `/dashboard`
- Erro: mensagem clara (ex.: credenciais inválidas) + manter inputs

### UX
- Loading no botão
- Validação de formato de e-mail
- Acessibilidade: labels + aria

## 8.2 Dashboard
- Exibir resumo: total eventos, total participantes e (um) bloco de próximos eventos ou últimas atividades
- Dados podem ser simulados se API não existir

### UX
- Skeleton/Loading
- Tratamento de erro (retry)
- Estado vazio quando não houver itens

## 8.3 Eventos
- Listagem em tabela ou cards:
  - nome, data, local, status e ações: editar/remover/ver detalhes
- Filtros:
  - por nome, status, período e/ou local
- Form (criar/editar):
  - nome, data/hora, local, status
- Atualização de UI:
  - otimista **ou** refetch após mutation

### UX
- Loading, erro, lista vazia
- Confirmação ao remover
- Manter filtros na navegação/refresh (querystring)

## 8.4 Participantes
- Listagem:
  - nome, e-mail, evento vinculado, check-in (feito/não feito) e ações (editar/remover)
- Filtros:
  - por nome, evento e check-in
- Form (criar/editar):
  - nome, e-mail, eventoId
- Transferência:
  - selecionar novo evento e salvar (mutation)

### UX
- Loading, erro, lista vazia
- Confirmação ao remover
- Validação de e-mail e duplicidade (se mock permitir)

## 8.5 Configuração de Check-in (coração do desafio)
Tela vinculada a um **evento específico**.

### Dados exibidos
- Lista de regras (cards ou tabela editável)
- Cada regra:
  - nome
  - ativo (toggle)
  - obrigatoriedade (obrigatório/opcional)
  - janela: liberar X min antes / encerrar Y min depois
  - ações: editar/remover

### Ações
- Adicionar regra
- Editar regra
- Remover regra
- Ativar/desativar regra
- Salvar regras no evento (PUT)

### 8.5.1 Estratégia de estado (recomendada)
**useReducer** (ou Zustand) para evitar “espaguete de setState”:
- `rules`: lista atual editável
- `initialRules`: snapshot carregado para comparar *dirty*
- `selectedRuleId`: regra em edição
- `ui`: { loading, saving, error, validationErrors, toastQueue }

Eventos do reducer:
- `LOAD_RULES_SUCCESS`
- `ADD_RULE`, `UPDATE_RULE`, `REMOVE_RULE`
- `TOGGLE_ACTIVE`, `SET_REQUIRED`
- `VALIDATE`, `SAVE_REQUEST`, `SAVE_SUCCESS`, `SAVE_ERROR`
- `RESET_CHANGES`

### 8.5.2 Validações obrigatórias (lógica definida)
1) **Deve existir ao menos 1 regra ativa**
- Considerar `rules.some(r => r.ativo)`
- Bloquear “Salvar” se violado e mostrar alerta persistente

2) **Conflito de janela de validação para regras obrigatórias**
Definição proposta (simples e justificável):
- Para cada regra ativa e obrigatória, calcula-se o intervalo permitido relativo ao evento:
  - `inicio = eventDateTime - liberarMinAntes`
  - `fim = eventDateTime + encerrarMinDepois`
- Conflito ocorre se existir **qualquer par** de regras obrigatórias/ativas cujo intervalo **não se intersecta**:
  - `intersection(inicioA..fimA, inicioB..fimB) = vazio`
- Justificativa: duas regras “obrigatórias” precisam ser cumpríveis dentro de um período comum de check-in; se não houver sobreposição, o usuário pode ficar impossibilitado de cumprir ambas.

3) **Campos numéricos**
- `liberarMinAntes >= 0`
- `encerrarMinDepois >= 0`
- Limites recomendados: 0..1440 (um dia), para evitar valores absurdos

4) **Nome da regra**
- obrigatório, tamanho mínimo (ex.: 3)
- evitar duplicidade por nome (opcional)

### 8.5.3 Alertas e feedbacks
- Banner fixo no topo da tela para violações críticas (ex.: “Nenhuma regra ativa”)
- Erros de campo inline no editor (form/modal)
- Toast para ações (criado/editado/removido/salvo)
- Desabilitar “Salvar” quando inválido ou enquanto `saving=true`

---

## 9. Camada de serviços e tratamento de erros

### 9.1 http client
- `http.ts` cria instância com:
  - baseURL (env)
  - interceptor request adicionando token
  - interceptor response tratando 401 (logout)

### 9.2 Padrão de retorno
- Services retornam dados tipados
- Erros mapeados para uma estrutura única:
  - `AppError { message, code?, details? }`

---

## 10. Responsividade e acessibilidade

- Layout mobile-first
- Sidebar colapsável em telas pequenas
- Tabela responsiva (stack/scroll) ou cards
- HTML semântico
- Inputs com label, `aria-invalid`, foco visível, navegação por teclado

---

## 11. Performance (mínimo)

- Evitar renders desnecessários (memo em componentes pesados)
- Paginação no frontend (se mock) ou backend (se existir)
- Debounce de filtros de busca (300–500ms)

---

## 12. Segurança (nível desafio)

- Token em `localStorage` (aceitável para desafio; registrar no README como decisão)
- Sanitização básica em campos de texto exibidos
- Proteção contra 401: limpar estado e redirecionar
- Não logar token em console

---

## 13. Testes (estratégia)

### 13.1 Unit / Component
- Login: validação + erro de credenciais
- RequireAuth: bloqueio de rota
- Eventos/Participantes: filtros e estados (loading/empty/error)

### 13.2 Check-in (principal)
- Validação: “ao menos 1 ativa”
- Validação: conflito de janelas obrigatórias
- Reducer: add/edit/remove/toggle

---

## 14. Padrões de entrega

- README com:
  - como rodar
  - como alternar API real/mock
  - decisões de arquitetura
  - link do deploy (se houver)
- ESLint + Prettier rodando no CI (opcional)
- Commits no padrão Conventional Commits (recomendado)

---

## 15. Critérios de aceite (Definition of Done)

- Login funcionando com token persistido e rotas protegidas
- Dashboard exibindo resumo (real ou mock)
- CRUD de eventos e participantes com filtros e feedbacks
- Tela de check-in:
  - CRUD de regras
  - ativar/desativar
  - validações implementadas + alertas claros
  - salvar regras por evento via PUT
- Estados de loading/erro/lista vazia em todas as telas
- Responsivo e acessível em nível básico
