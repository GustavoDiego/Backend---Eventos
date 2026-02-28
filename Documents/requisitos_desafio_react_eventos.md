# Requisitos Funcionais e Não Funcionais — Desafio Frontend React (Sistema de Eventos)

**Versão:** 1.0  
**Data:** 27/02/2026  
**Fonte:** desafio-novo.pdf

## 1. Visão geral

Aplicação web em **React** que simula um **painel do organizador de eventos**, responsável por:
- Autenticar usuário (JWT)
- Gerenciar **eventos**
- Gerenciar **participantes**
- Configurar **regras de check-in** (ponto de estado complexo)

### 1.1 Escopo

Inclui:
- Login/Logout e rotas protegidas
- Dashboard com resumo (real ou simulado)
- CRUD de eventos
- CRUD de participantes (inclui transferência entre eventos)
- Configuração e validações de regras de check-in por evento
- Integração com API real ou mockada

Fora do escopo (não solicitado no documento):
- Pagamentos, ingressos, venda de tickets
- Gestão de equipe/perfis/roles avançados
- Relatórios avançados e exportações

### 1.2 Premissas e dependências

- A API pode ser **real** ou **mockada** (ex.: JSON Server, MirageJS, MSW, mocks locais).
- O **token JWT** retornado no login deve ser armazenado no client e utilizado nas requisições autenticadas.
- A lógica de **conflito de janela de validação** (regras obrigatórias) deve ser **definida e justificada** na implementação.

---

## 2. Requisitos funcionais (RF)

> Convenção de prioridade: **MUST** (obrigatório), **SHOULD** (recomendado), **COULD** (opcional/diferencial).

### 2.1 Autenticação e controle de acesso

#### RF-01 — Tela de login (MUST)
**Descrição:** o sistema deve possuir tela de login com campos de **e-mail** e **senha** e autenticação via API REST.  
**Critérios de aceite:**
- Exibe campos e-mail e senha
- Submete para API (real ou mock)
- Sucesso: armazena token e redireciona (ex.: `/dashboard`)
- Falha: exibe mensagem de erro de credenciais inválidas

#### RF-02 — Armazenar e aplicar token JWT (MUST)
**Descrição:** após login, armazenar token JWT e utilizá-lo em requisições autenticadas.  
**Critérios de aceite:**
- Token persistido (ex.: storage)
- Token enviado nas requisições (ex.: `Authorization: Bearer <token>`)
- Sem token (ou inválido): negar acesso e redirecionar para login

#### RF-03 — Logout (MUST)
**Descrição:** deve existir logout, limpando token (invalidando no client) e redirecionando para login.  
**Critérios de aceite:**
- Remove token e dados de sessão no client
- Redireciona para `/login`
- Após logout, rotas protegidas não ficam acessíveis

### 2.2 Rotas e navegação

#### RF-04 — Rotas protegidas (MUST)
**Descrição:** rotas como `/dashboard`, `/eventos`, `/participantes` etc. devem exigir autenticação.  
**Critérios de aceite:**
- Usuário não autenticado: redirecionado para `/login`
- Usuário autenticado: acessa telas normalmente

---

### 2.3 Dashboard

#### RF-05 — Resumo no dashboard (MUST)
**Descrição:** painel inicial com resumo (real ou simulado):
- Total de eventos
- Total de participantes
- Próximos eventos (data/hora) **ou** últimas atividades (ex.: check-ins recentes)

**Critérios de aceite:**
- Exibe os indicadores mínimos
- Exibe feedback de carregamento quando aplicável
- Exibe erro quando falhar a obtenção de dados (quando aplicável)

---

### 2.4 Eventos

#### RF-06 — Listagem de eventos (MUST)
**Descrição:** listar eventos em tabela ou cards contendo:
- Nome do evento
- Data
- Local
- Status (Ativo/Encerrado)
- Ações: Editar/Remover/Ver detalhes

**Critérios de aceite:**
- Exibe os campos mínimos
- Possui ações por item
- Feedbacks: loading, erro, lista vazia

#### RF-07 — Buscar e filtrar eventos (MUST)
**Descrição:** permitir busca e filtros por **nome**, **status**, **período** ou **local**.  
**Critérios de aceite:**
- Busca por nome (texto)
- Filtro por status (Ativo/Encerrado)
- Filtro por período (intervalo) e/ou local
- Lista reflete filtros aplicados

#### RF-08 — Criar/editar evento (MUST)
**Descrição:** formulário para criar/editar evento; ações refletem na interface (otimista ou via refetch).  
**Critérios de aceite:**
- Cria evento e atualiza listagem
- Edita evento e atualiza listagem
- Feedbacks de sucesso/erro quando aplicável

#### RF-09 — Remover evento (MUST)
**Descrição:** remover evento e refletir na interface (otimista ou via refetch).  
**Critérios de aceite:**
- Remove evento selecionado
- Atualiza listagem após remoção
- Trata erro de remoção com mensagem apropriada

---

### 2.5 Participantes

#### RF-10 — Listagem de participantes (MUST)
**Descrição:** listar participantes com:
- Nome
- E-mail
- Evento vinculado
- Check-in (Feito/Não feito)
- Ações: Editar/Remover

**Critérios de aceite:**
- Exibe os campos mínimos
- Possui ações por item
- Feedbacks: loading, erro, lista vazia

#### RF-11 — Buscar e filtrar participantes (MUST)
**Descrição:** permitir buscar e filtrar por **nome**, **evento** e **check-in**.  
**Critérios de aceite:**
- Busca por nome (texto)
- Filtro por evento
- Filtro por check-in (Feito/Não feito)

#### RF-12 — Cadastrar/editar participante (MUST)
**Descrição:** formulário para cadastrar/editar participante e refletir na listagem.  
**Critérios de aceite:**
- Cria participante e atualiza listagem
- Edita participante e atualiza listagem
- Feedbacks de sucesso/erro quando aplicável

#### RF-13 — Transferir participante para outro evento (MUST)
**Descrição:** possibilitar transferência de participante para outro evento.  
**Critérios de aceite:**
- Permite selecionar evento destino
- Persiste alteração via API/mock
- Atualiza listagem refletindo o novo vínculo

#### RF-14 — Remover participante (MUST)
**Descrição:** remover participante e refletir na interface.  
**Critérios de aceite:**
- Remove participante selecionado
- Atualiza listagem após remoção
- Trata erro com mensagem apropriada

---

### 2.6 Configuração de check-in (estado complexo)

#### RF-15 — Tela de regras de check-in por evento (MUST)
**Descrição:** tela para configurar regras de check-in de um evento (coração do desafio).  
**Critérios de aceite:**
- Exibe regras do evento selecionado
- Mantém controle de estado claro
- Exibe alertas quando regras forem violadas

#### RF-16 — Estrutura de uma regra (MUST)
**Descrição:** cada regra deve conter:
- Nome da regra (ex.: QR Code, Documento, Lista Impressa, Confirmação por E-mail)
- Janela de validação: liberar check-in X minutos antes e encerrar Y minutos depois
- Obrigatoriedade: Obrigatório/Opcional

**Critérios de aceite:**
- CRUD do modelo com esses campos
- Validações básicas (ex.: valores numéricos coerentes) definidas pela implementação

#### RF-17 — Operações sobre regras (MUST)
**Descrição:** permitir:
- Adicionar regra
- Editar regra
- Remover regra
- Ativar/desativar regra

**Critérios de aceite:**
- Todas as operações disponíveis
- Estado visual de ativo/inativo claro
- Atualização refletida na UI (otimista ou refetch)

#### RF-18 — Validação: ao menos 1 regra ativa (MUST)
**Descrição:** deve existir ao menos 1 regra ativa.  
**Critérios de aceite:**
- Impedir desativar/remover a última regra ativa **ou**
- Permitir a ação e bloquear salvamento/confirmar com alerta e correção obrigatória (definir abordagem)

#### RF-19 — Validação: conflito de janela (MUST)
**Descrição:** não pode haver conflito de janela de validação entre **regras obrigatórias**. A lógica de conflito deve ser definida e justificada.  
**Critérios de aceite:**
- Implementa regra de incompatibilidade (definida pelo candidato)
- Aponta regras em conflito
- Exibe alertas claros e orienta correção

---

### 2.7 Integração com API

#### RF-20 — Suporte aos endpoints sugeridos (MUST)
**Descrição:** suportar API real ou mockada com endpoints sugeridos no documento.  
**Critérios de aceite:**
- Login retorna `{ token }`
- Dashboard fornece dados de resumo
- Eventos e participantes com operações CRUD
- Regras de check-in consultadas/atualizadas por evento

### 2.8 Feedbacks (UX mínimo)

#### RF-21 — Feedbacks de loading/erro/lista vazia (MUST)
**Descrição:** telas de eventos e participantes devem exibir feedbacks de **loading**, **erro** e **lista vazia**.  
**Critérios de aceite:**
- Loading visível em carregamentos
- Erro exibido com mensagem compreensível
- Lista vazia exibida de forma explícita

---

## 3. Requisitos não funcionais (RNF)

### 3.1 Qualidade técnica e arquitetura

#### RNF-01 — Arquitetura organizada e escalável (MUST)
- Estrutura de projeto coerente (pastas/camadas)
- Separação entre UI, serviços e lógica de negócio
- Componentização reutilizável

#### RNF-02 — Boas práticas de React (MUST)
- Uso adequado de hooks
- Componentes pequenos e focados
- Separação de responsabilidades (lógica fora do JSX quando possível)

#### RNF-03 — Gerenciamento de estado (MUST)
- Estado bem pensado, principalmente na tela de check-in
- Validações centralizadas e previsíveis
- Atualizações consistentes e com feedbacks

### 3.2 Segurança e controle de acesso

#### RNF-04 — JWT e rotas protegidas (MUST)
- Token aplicado em requisições autenticadas
- Rotas bloqueadas sem autenticação
- Logout remove token e sessão local

### 3.3 Usabilidade e interface

#### RNF-05 — HTML semântico e responsividade (SHOULD)
- HTML semântico
- Layout responsivo (desktop/mobile)

#### RNF-06 — UX e feedbacks consistentes (MUST)
- Loading/erro/alertas de validação consistentes
- Mensagens claras (sem “erro genérico”)

#### RNF-07 — Consistência visual (SHOULD)
- Padrão visual único (cores, espaçamento, tipografia)

### 3.4 Diferenciais valorizados (opcionais)

#### RNF-08 — TypeScript (COULD)
- Tipagem de entidades e contratos de API

#### RNF-09 — Testes (COULD)
- Jest + Testing Library em fluxos críticos

#### RNF-10 — Deploy (COULD)
- Deploy em Vercel/Netlify (link opcional)

#### RNF-11 — Padronização (COULD)
- ESLint + Prettier
- Conventional Commits

---

## 4. Apêndice — Endpoints sugeridos

| Método/Rota | Finalidade |
|---|---|
| POST `/auth/login` | Autenticar e retornar `{ token }` |
| GET `/dashboard` | Dados de resumo do painel |
| GET/POST/PUT/DELETE `/eventos` | CRUD de eventos |
| GET/POST/PUT/DELETE `/participantes` | CRUD de participantes |
| GET/PUT `/eventos/:id/regras-checkin` | Buscar/atualizar regras de check-in do evento |

---

## 5. Entregáveis

- Link do repositório público com o código-fonte
- (Opcional) Link do deploy
