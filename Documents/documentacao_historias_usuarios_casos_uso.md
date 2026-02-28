# Documentação — Histórias de Usuário e Casos de Uso
**Desafio Técnico (Frontend React): Sistema de Eventos – Painel do Organizador**

> Sem drama: o “coração” aqui é a tela de **Configuração de Check-in** — é onde o estado vira gente grande.

---

## 1. Contexto e objetivo
A aplicação web simula um painel para organizadores de eventos, com autenticação e gerenciamento de **eventos**, **participantes** e **regras de check-in**. O objetivo é entregar uma base funcional, bem organizada e com UX consistente (loading/erro/vazio/alertas).

---

## 2. Perfis (Personas)
### P1 — Organizador (Usuário Principal)
- Responsável por criar e administrar eventos e participantes.
- Precisa controlar regras de check-in para evitar confusão no dia do evento.

### P2 — Sistema (Ator Secundário)
- API REST (real ou mockada) que autentica, persiste e retorna dados.

---

## 3. Glossário (termos do domínio)
- **Evento**: item com nome, data, local e status (Ativo/Encerrado).
- **Participante**: pessoa vinculada a um evento; possui status de check-in (Feito/Não feito).
- **Regra de check-in**: critério exigido/permitido para validar presença (ex.: QR Code).
- **Janela de validação**: período relativo ao horário do evento (liberar X min antes / encerrar Y min depois).
- **Regra ativa**: regra habilitada para uso.
- **Obrigatoriedade**: Obrigatório ou Opcional.

---

## 4. Epics e Histórias de Usuário
> Convenções:
- **US-xx**: User Story
- Prioridade: **MUST** (obrigatório), **SHOULD** (recomendado), **COULD** (opcional)
- Critérios de aceitação no formato **Given/When/Then**

### EPIC A — Autenticação e rotas protegidas
#### US-01 — Realizar login
**Como** organizador, **quero** autenticar com e-mail e senha, **para** acessar o painel.
- Prioridade: MUST
- Critérios de aceitação:
  - Given que estou na tela de login  
    When informo e-mail e senha válidos e envio  
    Then o sistema autentica via API e me redireciona para o dashboard  
  - Given credenciais inválidas  
    When envio o login  
    Then o sistema exibe mensagem de erro clara e não navega  
  - Given login bem-sucedido  
    When recebo o token  
    Then o token é armazenado e usado nas requisições autenticadas

#### US-02 — Proteger rotas do painel
**Como** organizador, **quero** que rotas do painel exijam autenticação, **para** manter acesso restrito.
- Prioridade: MUST
- Critérios de aceitação:
  - Given que não tenho token válido  
    When tento acessar /dashboard, /eventos, /participantes  
    Then sou redirecionado para /login

#### US-03 — Realizar logout
**Como** organizador, **quero** sair do sistema, **para** encerrar minha sessão.
- Prioridade: MUST
- Critérios de aceitação:
  - Given que estou autenticado  
    When clico em “Sair”  
    Then o token é invalidado/limpo do storage e sou redirecionado para /login

---

### EPIC B — Dashboard
#### US-04 — Visualizar resumo no dashboard
**Como** organizador, **quero** ver um resumo inicial, **para** ter visão rápida do cenário.
- Prioridade: MUST
- Conteúdo mínimo:
  - total de eventos
  - total de participantes
  - próximos eventos (data/hora) **ou** últimas atividades (ex.: check-ins recentes)
- Critérios de aceitação:
  - Given que acessei /dashboard autenticado  
    When o painel carregar  
    Then vejo os indicadores e um bloco de contexto (próximos eventos ou atividades)
  - Given que a API esteja indisponível  
    When o dashboard carregar  
    Then vejo feedback de erro e opção de tentar novamente (quando aplicável)

---

### EPIC C — Eventos (CRUD + filtros)
#### US-05 — Listar eventos
**Como** organizador, **quero** listar eventos em tabela ou cards, **para** gerenciá-los.
- Prioridade: MUST
- Campos mínimos: nome, data, local, status (Ativo/Encerrado) e ações (Editar/Remover/Ver detalhes)
- Critérios de aceitação:
  - Given que estou em /eventos  
    When a listagem carregar  
    Then vejo os eventos com ações disponíveis
  - Given que não existam eventos  
    Then vejo estado vazio informativo

#### US-06 — Buscar e filtrar eventos
**Como** organizador, **quero** buscar/filtrar eventos, **para** encontrar rapidamente o que preciso.
- Prioridade: MUST
- Filtros: nome, status, período e/ou local
- Critérios de aceitação:
  - Given que estou na listagem  
    When aplico filtros  
    Then a lista é atualizada e exibe feedback (loading/erro/vazio) conforme o caso

#### US-07 — Criar evento
**Como** organizador, **quero** cadastrar um evento, **para** disponibilizá-lo no painel.
- Prioridade: MUST
- Critérios de aceitação:
  - Given formulário válido  
    When salvo  
    Then evento é criado via API e aparece na listagem (via otimista ou refetch)

#### US-08 — Editar evento
**Como** organizador, **quero** editar um evento, **para** corrigir ou atualizar informações.
- Prioridade: MUST
- Critérios de aceitação:
  - Given que selecionei editar  
    When salvo alterações válidas  
    Then mudanças refletem na interface (otimista ou refetch)

#### US-09 — Remover evento
**Como** organizador, **quero** remover um evento, **para** manter a base limpa.
- Prioridade: MUST
- Critérios de aceitação:
  - Given que confirmo a remoção  
    When removo o evento  
    Then ele desaparece da listagem e recebo feedback de sucesso/erro

---

### EPIC D — Participantes (CRUD + filtros + transferência)
#### US-10 — Listar participantes
**Como** organizador, **quero** listar participantes, **para** acompanhar presença e gestão.
- Prioridade: MUST
- Campos mínimos: nome, e-mail, evento vinculado, check-in (Feito/Não feito) e ações (Editar/Remover)
- Critérios de aceitação:
  - Given que estou em /participantes  
    When a listagem carregar  
    Then vejo participantes com check-in e ações

#### US-11 — Buscar e filtrar participantes
**Como** organizador, **quero** buscar/filtrar participantes, **para** localizar pessoas rapidamente.
- Prioridade: MUST
- Filtros: nome, evento e check-in
- Critérios de aceitação:
  - Given filtros aplicados  
    When atualizo critérios  
    Then a lista é atualizada com feedbacks adequados

#### US-12 — Cadastrar participante
**Como** organizador, **quero** cadastrar um participante, **para** vinculá-lo a um evento.
- Prioridade: MUST
- Critérios de aceitação:
  - Given dados válidos  
    When salvo  
    Then participante é criado e aparece na listagem

#### US-13 — Editar participante
**Como** organizador, **quero** editar dados de um participante, **para** corrigir informações.
- Prioridade: MUST

#### US-14 — Remover participante
**Como** organizador, **quero** remover um participante, **para** manter registros consistentes.
- Prioridade: MUST

#### US-15 — Transferir participante para outro evento
**Como** organizador, **quero** transferir um participante para outro evento, **para** corrigir alocação.
- Prioridade: MUST
- Critérios de aceitação:
  - Given que escolhi transferir e selecionei outro evento  
    When confirmo  
    Then o participante passa a ficar vinculado ao novo evento e a UI reflete isso

---

### EPIC E — Configuração de Check-in (estado complexo)
#### US-16 — Visualizar regras de check-in do evento
**Como** organizador, **quero** ver as regras de check-in de um evento, **para** configurá-las.
- Prioridade: MUST
- Cada regra deve conter:
  - nome (ex.: QR Code, Documento, Lista Impressa, Confirmação por E-mail)
  - janela de validação (liberar X min antes / encerrar Y min depois)
  - obrigatoriedade (Obrigatório/Opcional)
  - ativo (ativar/desativar)
- Critérios de aceitação:
  - Given que entrei na tela do evento  
    When acesso “Configuração de Check-in”  
    Then vejo a lista de regras e seus atributos

#### US-17 — Adicionar regra de check-in
**Como** organizador, **quero** adicionar uma regra, **para** ampliar opções de validação.
- Prioridade: MUST

#### US-18 — Editar regra de check-in
**Como** organizador, **quero** editar uma regra, **para** ajustar janela e obrigatoriedade.
- Prioridade: MUST

#### US-19 — Remover regra de check-in
**Como** organizador, **quero** remover uma regra, **para** eliminar critérios desnecessários.
- Prioridade: MUST

#### US-20 — Ativar/desativar regra
**Como** organizador, **quero** ativar/desativar regras, **para** controlar o que vale no evento.
- Prioridade: MUST

#### US-21 — Validar: deve existir ao menos 1 regra ativa
**Como** organizador, **quero** ser impedido de salvar configurações inválidas, **para** evitar check-in sem regras.
- Prioridade: MUST
- Critérios de aceitação:
  - Given que nenhuma regra está ativa  
    When tento salvar  
    Then vejo alerta claro e o salvamento é bloqueado

#### US-22 — Validar: regras obrigatórias não podem ter janela incompatível
**Como** organizador, **quero** alertas de conflito, **para** evitar regras impossíveis de cumprir.
- Prioridade: MUST
- Observação: a lógica de conflito deve ser definida e justificada na implementação (documentar no README).
- Critérios de aceitação:
  - Given duas regras obrigatórias ativas com janela totalmente incompatível  
    When tento salvar  
    Then vejo alerta de conflito e o salvamento é bloqueado

#### US-23 — Exibir alertas e feedbacks consistentes
**Como** organizador, **quero** feedbacks de validação, loading e erro, **para** operar com segurança.
- Prioridade: MUST
- Critérios de aceitação:
  - Given erros de validação  
    When configuro regras  
    Then vejo alertas claros (banner/toast/inline)  
  - Given salvamento em andamento  
    Then vejo loading e ações desabilitadas adequadamente

---

### EPIC F — Qualidade (diferenciais valorizados)
> São diferenciais, não bloqueadores do “mínimo funcional”.
- US-24: TypeScript (SHOULD)  
- US-25: Testes (Jest + Testing Library) (SHOULD)  
- US-26: Deploy em Vercel/Netlify (COULD)  
- US-27: Auth global via Context API (SHOULD)  
- US-28: ESLint + Prettier (SHOULD)  
- US-29: Conventional Commits (COULD)  
- US-30: Consistência visual (SHOULD)

---

## 5. Casos de Uso (Use Cases)
> Convenções: **UC-xx**
>  
> Formato: Objetivo, Ator principal, Pré-condições, Gatilho, Fluxo principal, Extensões, Pós-condições.

### UC-01 — Autenticar (Login)
- **Ator principal:** Organizador
- **Objetivo:** Autenticar e obter token JWT
- **Pré-condições:** Usuário não autenticado
- **Gatilho:** Clicar em “Entrar” após preencher e-mail/senha
- **Fluxo principal:**
  1. Organizador informa e-mail e senha
  2. Sistema valida formato básico (ex.: e-mail)
  3. Sistema envia `POST /auth/login`
  4. API retorna `{ token }`
  5. Sistema armazena token e navega para `/dashboard`
- **Extensões:**
  - 3a. API retorna erro (401/400) → exibir mensagem “Credenciais inválidas” e manter na tela
  - 3b. Erro de rede → exibir erro e permitir tentar novamente
- **Pós-condições:** Token persistido e sessão iniciada

### UC-02 — Encerrar sessão (Logout)
- **Ator principal:** Organizador
- **Objetivo:** Encerrar sessão e bloquear acesso ao painel
- **Pré-condições:** Usuário autenticado
- **Gatilho:** Clicar em “Sair”
- **Fluxo principal:**
  1. Sistema remove token do storage
  2. Sistema limpa estado de auth
  3. Sistema redireciona para `/login`
- **Pós-condições:** Rotas protegidas bloqueadas

### UC-03 — Acessar dashboard
- **Ator principal:** Organizador
- **Objetivo:** Visualizar resumo inicial
- **Pré-condições:** Autenticado
- **Gatilho:** Entrar em `/dashboard`
- **Fluxo principal:**
  1. Sistema chama `GET /dashboard` (ou usa dados simulados)
  2. Exibe totais e bloco (próximos eventos ou últimas atividades)
- **Extensões:**
  - 1a. Erro de API → exibir estado de erro + retry
- **Pós-condições:** Resumo exibido

### UC-04 — Listar eventos
- **Ator principal:** Organizador
- **Objetivo:** Ver eventos existentes e acessar ações
- **Pré-condições:** Autenticado
- **Gatilho:** Entrar em `/eventos`
- **Fluxo principal:**
  1. Sistema carrega eventos (`GET /eventos`)
  2. Exibe tabela/cards com campos e ações
- **Extensões:**
  - 1a. Lista vazia → exibir estado vazio
  - 1b. Erro → estado de erro + retry
- **Pós-condições:** Eventos visíveis

### UC-05 — Filtrar eventos
- **Ator principal:** Organizador
- **Objetivo:** Encontrar eventos por critérios
- **Pré-condições:** Listagem de eventos acessada
- **Gatilho:** Alterar filtro/busca
- **Fluxo principal:**
  1. Organizador ajusta filtros (nome/status/período/local)
  2. Sistema atualiza listagem (refetch ou filtro local)
- **Pós-condições:** Lista filtrada

### UC-06 — Criar evento
- **Ator principal:** Organizador
- **Objetivo:** Cadastrar um evento
- **Pré-condições:** Autenticado
- **Gatilho:** Clicar em “Novo evento”
- **Fluxo principal:**
  1. Organizador preenche formulário
  2. Sistema valida campos obrigatórios
  3. Sistema envia `POST /eventos`
  4. Sistema atualiza UI (otimista ou refetch)
- **Extensões:**
  - 3a. Erro de validação/API → exibir erro e manter dados
- **Pós-condições:** Evento criado

### UC-07 — Editar evento
- **Ator principal:** Organizador
- **Objetivo:** Atualizar dados do evento
- **Pré-condições:** Evento existente
- **Gatilho:** Clicar em “Editar”
- **Fluxo principal:**
  1. Sistema abre formulário com dados do evento
  2. Organizador altera campos
  3. Sistema envia `PUT /eventos/:id`
  4. Sistema reflete alterações na UI
- **Pós-condições:** Evento atualizado

### UC-08 — Remover evento
- **Ator principal:** Organizador
- **Objetivo:** Excluir evento
- **Pré-condições:** Evento existente
- **Gatilho:** Clicar em “Remover” e confirmar
- **Fluxo principal:**
  1. Sistema solicita confirmação
  2. Organizador confirma
  3. Sistema envia `DELETE /eventos/:id`
  4. Sistema remove item da UI e notifica sucesso
- **Extensões:**
  - 3a. Erro → exibir mensagem e manter item
- **Pós-condições:** Evento removido

### UC-09 — Listar participantes
- **Ator principal:** Organizador
- **Objetivo:** Ver participantes e status de check-in
- **Pré-condições:** Autenticado
- **Gatilho:** Entrar em `/participantes`
- **Fluxo principal:**
  1. Sistema carrega participantes (`GET /participantes`)
  2. Exibe nome, e-mail, evento, check-in e ações
- **Extensões:** loading/erro/vazio
- **Pós-condições:** Participantes visíveis

### UC-10 — Filtrar participantes
- **Ator principal:** Organizador
- **Objetivo:** Encontrar participante por critérios
- **Pré-condições:** Listagem aberta
- **Gatilho:** Alterar filtros (nome/evento/check-in)
- **Fluxo principal:**
  1. Organizador ajusta filtros
  2. Sistema atualiza listagem
- **Pós-condições:** Lista filtrada

### UC-11 — Criar participante
- **Ator principal:** Organizador
- **Objetivo:** Cadastrar participante
- **Pré-condições:** Autenticado; existe ao menos 1 evento (recomendado)
- **Gatilho:** Clicar em “Novo participante”
- **Fluxo principal:**
  1. Organizador preenche dados e escolhe evento
  2. Sistema valida campos
  3. Sistema envia `POST /participantes`
  4. Sistema atualiza UI
- **Pós-condições:** Participante criado

### UC-12 — Editar participante
- **Ator principal:** Organizador
- **Objetivo:** Atualizar dados do participante
- **Pré-condições:** Participante existente
- **Gatilho:** Clicar em “Editar”
- **Fluxo principal:**
  1. Sistema abre formulário com dados atuais
  2. Organizador ajusta informações
  3. Sistema envia `PUT /participantes/:id`
  4. Sistema reflete mudanças na UI
- **Pós-condições:** Participante atualizado

### UC-13 — Remover participante
- **Ator principal:** Organizador
- **Objetivo:** Excluir participante
- **Pré-condições:** Participante existente
- **Gatilho:** Clicar em “Remover” e confirmar
- **Fluxo principal:**
  1. Sistema solicita confirmação
  2. Organizador confirma
  3. Sistema envia `DELETE /participantes/:id`
  4. Sistema remove da UI e notifica
- **Pós-condições:** Participante removido

### UC-14 — Transferir participante para outro evento
- **Ator principal:** Organizador
- **Objetivo:** Alterar vínculo do participante para um novo evento
- **Pré-condições:** Participante existente; existem outros eventos
- **Gatilho:** Acionar “Transferir” (ou editar evento do participante)
- **Fluxo principal:**
  1. Sistema solicita seleção do novo evento
  2. Organizador seleciona e confirma
  3. Sistema persiste alteração (ex.: `PUT /participantes/:id` com novo `eventoId`)
  4. Sistema atualiza UI
- **Extensões:**
  - 3a. Erro → exibir mensagem e manter vínculo anterior
- **Pós-condições:** Participante vinculado ao novo evento

### UC-15 — Carregar regras de check-in do evento
- **Ator principal:** Organizador
- **Objetivo:** Visualizar regras atuais de check-in
- **Pré-condições:** Evento existente; autenticado
- **Gatilho:** Abrir “Configuração de Check-in” do evento
- **Fluxo principal:**
  1. Sistema chama `GET /eventos/:id/regras-checkin`
  2. Exibe regras com: nome, janela, obrigatoriedade, ativo
- **Extensões:** erro/empty/loading
- **Pós-condições:** Regras prontas para edição

### UC-16 — Manter regras de check-in (CRUD local)
- **Ator principal:** Organizador
- **Objetivo:** Adicionar, editar, remover e ativar/desativar regras
- **Pré-condições:** Regras carregadas (ou estado inicial vazio)
- **Gatilho:** Ações na UI
- **Fluxo principal:**
  1. Organizador adiciona/edita/remove/ativa/desativa regras
  2. Sistema atualiza estado local e revalida regras
  3. Sistema exibe alertas quando houver violação
- **Pós-condições:** Estado local atualizado e consistente

### UC-17 — Salvar regras de check-in do evento (com validações)
- **Ator principal:** Organizador
- **Objetivo:** Persistir regras válidas na API
- **Pré-condições:** Configuração em edição; autenticado
- **Gatilho:** Clicar em “Salvar”
- **Fluxo principal:**
  1. Sistema valida regra “ao menos 1 regra ativa”
  2. Sistema valida conflitos de janela para regras obrigatórias (conforme lógica definida)
  3. Se válido, sistema envia `PUT /eventos/:id/regras-checkin`
  4. Sistema mostra feedback de sucesso e atualiza snapshot/estado (refetch ou commit)
- **Extensões:**
  - 1a. Nenhuma regra ativa → bloquear salvamento e exibir alerta
  - 2a. Conflito detectado → bloquear salvamento e exibir alerta de conflito
  - 3a. Erro de API → exibir erro e manter alterações no estado local
- **Pós-condições:** Regras persistidas (quando sucesso) e UI consistente

---

## 6. Matriz rápida de rastreabilidade (US → UC)
- Autenticação: US-01/02/03 → UC-01/02  
- Dashboard: US-04 → UC-03  
- Eventos: US-05/06/07/08/09 → UC-04/05/06/07/08  
- Participantes: US-10/11/12/13/14/15 → UC-09/10/11/12/13/14  
- Check-in: US-16..23 → UC-15/16/17

---

## 7. Observações finais (de produto e avaliação)
- O documento do desafio deixa claro que a avaliação prioriza **arquitetura**, **estado/lógica**, **JWT/rotas protegidas** e **boas práticas React**.  
- Estados essenciais em todas as telas: **loading**, **erro**, **lista vazia** e, na tela de check-in, **alertas de validação**.

