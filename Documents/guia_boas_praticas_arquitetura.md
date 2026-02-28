# Guia de Boas Práticas, Arquitetura e Organização — Desafio Frontend React
**Painel do Organizador (Eventos / Participantes / Regras de Check-in)**

> Objetivo: orientar um desenvolvimento limpo, consistente e escalável.  
> Regra de ouro: **estado previsível + código previsível**. O resto é perfumaria útil.

---

## 1) Princípios de arquitetura (o que manda aqui)
1. **Separação de responsabilidades**
   - Página (route) orquestra
   - Componentes apresentam
   - Services acessam API
   - Domínio valida e tipa
2. **Fonte única de verdade**
   - Auth centralizada
   - Dados remotos via cache (React Query)
   - Estado complexo local via reducer (Check-in)
3. **Previsibilidade**
   - Fluxos claros de loading/erro/vazio
   - Validação consistente (schema)
4. **Escalabilidade**
   - Estrutura de pastas estável
   - Componentização e reuso
5. **UX de produção**
   - Erros explícitos, feedback imediato, ações desabilitadas quando necessário

---

## 2) Estrutura de projeto (recomendada)
```
src/
  app/
    router.tsx
    providers/
      AuthProvider.tsx
      QueryProvider.tsx
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
  components/
    layout/
      AppShell/
      Sidebar/
      Topbar/
    ui/
      Button/
      Input/
      Select/
      Modal/
      Table/
      EmptyState/
      Loading/
      Toast/
      BannerAlert/
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

### Regras rápidas
- `pages/`: apenas composição de tela e integração (hooks + serviços)
- `components/ui/`: componentes “burros” e reutilizáveis
- `domain/`: tipos + validação (Zod)
- `services/`: chamadas HTTP + mapeamento de erros
- `state/`: stores/reducers quando necessário
- `utils/`: utilitários puros (sem dependência de React)

---

## 3) Padrões de nomenclatura
- Pastas de páginas e componentes: **PascalCase**
- Hooks: `useXxx`
- Services: `xxx.service.ts`
- Types: `Xxx`, `XxxRequest`, `XxxResponse`
- Constants: `UPPER_SNAKE_CASE`
- Arquivos de schema: `*.schema.ts` (Zod)

---

## 4) Roteamento e proteção (React Router)
### Boas práticas
- Rotas públicas: `/login`
- Rotas protegidas: `/dashboard`, `/eventos`, `/participantes`, etc.
- Use um wrapper `RequireAuth` para proteger rotas

**Pontos obrigatórios**
- Ao receber 401: limpar token e redirecionar para `/login`
- Evitar duplicação de guards em cada página

---

## 5) Auth (JWT) — organização e cuidado
### Onde guardar o token?
- Para desafio: **localStorage** é aceitável.
- Documentar a decisão no README (prós/contras).

### Regras
- `AuthProvider` mantém estado (token e usuário se houver)
- `http.ts` injeta `Authorization: Bearer <token>`
- Nunca logar token no console
- Sempre tratar “token ausente/expirado” como **logout forçado**

---

## 6) Dados remotos (React Query / TanStack Query)
### Por que usar?
- Cache, refetch, controle de loading e erro, mutations consistentes

### Padrão recomendado
- Queries por página:
  - `useQuery(['events', filters], fetchEvents)`
- Mutations:
  - `useMutation(createEvent, { onSuccess: invalidateQueries(...) })`
- Decidir entre:
  - **otimista** (boa UX, mais complexidade)
  - **refetch** (simples, confiável)

**Regra**: se o desafio é curto, refetch é “suficientemente bom”.

---

## 7) Estado complexo (Check-in) — usar reducer, sem choro
A tela de regras de check-in tem:
- lista editável
- validações cruzadas
- bloqueio de salvamento
- alertas persistentes

### Modelo de estado (exemplo)
```ts
type CheckinState = {
  rules: CheckinRule[];
  initialRules: CheckinRule[];
  loading: boolean;
  saving: boolean;
  error?: string;
  validationErrors: string[];
  isDirty: boolean;
};
```

### Eventos do reducer
- `LOAD_SUCCESS`
- `ADD_RULE`
- `UPDATE_RULE`
- `REMOVE_RULE`
- `TOGGLE_ACTIVE`
- `VALIDATE`
- `SAVE_REQUEST / SAVE_SUCCESS / SAVE_ERROR`
- `RESET_CHANGES`

**Benefício**: previsibilidade e rastreabilidade do fluxo.

---

## 8) Validação e formulários (React Hook Form + Zod)
### Regras
- Toda validação “de campo” em Zod:
  - tipos, required, limites, e-mail etc.
- Validação “de tela” (cross-field / cross-rule) em `domain/checkin/checkin.validation.ts`

### Dica prática
- Valide localmente antes do `PUT` (salvar)
- Exiba erros:
  - inline (campo)
  - banner (violação crítica)
  - toast (resultado de action)

---

## 9) UX consistente: loading / erro / vazio (sempre)
### Checklist por tela
- **Loading**: skeleton/spinner + ações desabilitadas
- **Erro**: mensagem clara + botão “Tentar novamente” quando fizer sentido
- **Vazio**: estado informativo com CTA (ex.: “Criar evento”)
- **Sucesso**: toast ou feedback visual rápido

> Se faltar isso, parece protótipo. E o avaliador percebe.

---

## 10) Componentização (o que virar componente?)
Crie componentes reutilizáveis quando:
- aparece em 2+ lugares
- tem regras de UX repetidas (Input com erro, Modal padrão, Table padrão)
- tem layout estável

### Regra
- Componentes de `ui/` não devem conhecer “Event/Participant”
- Componentes de `pages/` podem compor e conectar dados

---

## 11) Serviços e camada HTTP (limpo e padronizado)
### http client
- Um único `http.ts`:
  - baseURL via env
  - interceptors para token e 401
  - normalização de erros

### Services
- Cada domínio tem um service:
  - `events.service.ts`, `participants.service.ts`, etc.
- Services retornam dados tipados, sem lógica de UI

### Padronização de erros
Crie um tipo:
```ts
type AppError = { message: string; code?: string; details?: unknown };
```

---

## 12) Acessibilidade (mínimo profissional)
- Inputs com `<label>` associado
- Erros com `aria-invalid` e mensagem vinculada
- Navegação por teclado (tab)
- Foco visível
- Botões com texto/aria-label quando só houver ícone

---

## 13) Performance (o básico que evita vergonha)
- Debounce de busca (300–500ms)
- Paginação quando lista cresce
- `useMemo`/`React.memo` só quando realmente necessário
- Evitar re-renders por props instáveis

---

## 14) Segurança (nível desafio)
- Não expor token
- Tratar 401 corretamente
- Não confiar em “dados do cliente” (sim, mesmo no mock)
- Sanitizar/escapar conteúdo se houver input exibido diretamente

---

## 15) Testes (onde vale o esforço)
### Prioridade
1. **Auth guard** (RequireAuth)
2. **Check-in reducer + validações**
3. Fluxos críticos (login erro/sucesso)

### Tipos
- Unit: reducer/validações
- Component: comportamento de página (Loading/Erro/Vazio)
- Mock API com MSW quando possível

---

## 16) Padrões de Git e entrega
### Commits
- Conventional Commits recomendado:
  - `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`

### README obrigatório
- Como rodar
- Variáveis de ambiente
- API real x mock (como alternar)
- Decisões (ex.: token no localStorage)
- Deploy (se houver)

---

## 17) Checklist final (antes de enviar)
- [ ] Login funciona e guarda token
- [ ] Rotas protegidas bloqueiam sem token
- [ ] Dashboard tem loading/erro/vazio
- [ ] Eventos: CRUD + filtros + confirmação ao remover
- [ ] Participantes: CRUD + filtros + transferência
- [ ] Check-in: CRUD local de regras + validações + salvar
- [ ] Nenhuma tela “quebra” sem dados
- [ ] Responsivo no mobile
- [ ] Lint/format ok

---

## 18) Padrão de “pronto” (Definition of Done)
Um recurso está pronto quando:
- atende aos critérios de aceitação
- tem feedback de UI (loading/erro/vazio)
- não vaza estado (ex.: modal fecha e limpa)
- não quebra ao recarregar a página
- está documentado no README quando a decisão for relevante

---

### Anexo: padrões rápidos de UI (sugestão)
- Toast para: criar/editar/remover/salvar
- Banner para: validações críticas (ex.: “Nenhuma regra ativa”)
- Modal de confirmação para remoções
- Botões desabilitados enquanto `loading/saving=true`

