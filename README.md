# 🎫 Backend — Sistema de Eventos (Painel do Organizador)

Backend em **NestJS** para o sistema de gerenciamento de eventos, com autenticação JWT, CRUD completo de eventos/participantes, configuração de regras de check-in com validações de negócio, e documentação Swagger.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e execução](#-instalação-e-execução)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Swagger](#-swagger)
- [Segurança](#-segurança)
- [Regras de negócio — Check-in](#-regras-de-negócio--check-in)
- [Decisões de arquitetura](#-decisões-de-arquitetura)
- [Scripts disponíveis](#-scripts-disponíveis)

---

## 🛠 Tecnologias

| Tecnologia | Finalidade |
|---|---|
| **NestJS 10** | Framework backend (Node.js) |
| **TypeScript** | Tipagem estática |
| **Prisma** | ORM para PostgreSQL |
| **PostgreSQL** | Banco de dados |
| **Passport + JWT** | Autenticação |
| **class-validator** | Validação de DTOs |
| **Swagger (OpenAPI)** | Documentação interativa |
| **Helmet** | Headers de segurança HTTP |
| **@nestjs/throttler** | Rate limiting |
| **bcrypt** | Hash de senhas |
| **Docker Compose** | PostgreSQL local |

---

## 🏗 Arquitetura

```
src/
├── auth/                   # Autenticação (JWT, login, registro)
│   ├── decorators/         # @Public()
│   ├── dto/                # LoginDto, RegisterDto, AuthResponseDto
│   ├── guards/             # JwtAuthGuard (global)
│   ├── interfaces/         # JwtPayload
│   └── strategies/         # JwtStrategy (Passport)
├── checkin-rules/          # Regras de check-in por evento
│   └── dto/                # CheckinRuleDto, UpdateCheckinRulesDto
├── common/                 # Compartilhados
│   ├── decorators/         # @CurrentUser()
│   ├── filters/            # AllExceptionsFilter (global)
│   └── interceptors/       # TransformInterceptor (global)
├── dashboard/              # Resumo do painel
│   └── dto/                # DashboardResponseDto
├── events/                 # CRUD de eventos
│   └── dto/                # CreateEventDto, UpdateEventDto, FilterEventsDto
├── participants/           # CRUD de participantes + transferência
│   └── dto/                # Create, Update, Filter, TransferParticipantDto
├── prisma/                 # PrismaService + PrismaModule (global)
├── app.module.ts           # Módulo raiz
└── main.ts                 # Bootstrap (Swagger, Helmet, CORS, Validation)
```

### Princípios seguidos
- **Separação de responsabilidades** — Cada módulo encapsula controller, service e DTOs
- **Guard JWT global** — Todas as rotas protegidas por padrão; use `@Public()` para exceções
- **Filtro de exceções global** — Respostas de erro padronizadas
- **Interceptor de resposta global** — Respostas de sucesso padronizadas
- **Validação com class-validator** — DTOs validados automaticamente via `ValidationPipe`

---

## ✅ Pré-requisitos

- **Node.js** >= 18
- **npm** ou **yarn**
- **Docker** (para PostgreSQL) ou PostgreSQL local
- **Git**

---

## 🚀 Instalação e execução

### 1. Clonar o repositório
```bash
git clone https://github.com/GustavoDiego/Backend---Eventos.git
cd "Backend - Eventos"
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env se necessário (ex.: JWT_SECRET para produção)
```

### 4. Subir o PostgreSQL (Docker)
```bash
docker-compose up -d
```

### 5. Executar migrações do banco
```bash
npx prisma migrate dev --name init
```

### 6. Popular o banco com dados de exemplo (seed)
```bash
npx prisma db seed
```

### 7. Rodar o servidor em modo desenvolvimento
```bash
npm run start:dev
```

### 8. Acessar
- **API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/api/docs

### Credenciais de teste (seed)
| E-mail | Senha |
|---|---|
| `admin@eventos.com` | `senha123` |
| `maria@eventos.com` | `senha123` |

---

## ⚙️ Variáveis de ambiente

| Variável | Descrição | Default |
|---|---|---|
| `NODE_ENV` | Ambiente | `development` |
| `PORT` | Porta do servidor | `3000` |
| `DATABASE_URL` | Connection string PostgreSQL | (ver .env.example) |
| `JWT_SECRET` | Chave secreta do JWT | (trocar em produção!) |
| `JWT_EXPIRES_IN` | Expiração do token | `1d` |
| `THROTTLE_TTL` | Janela do rate limit (ms) | `60000` |
| `THROTTLE_LIMIT` | Requisições por janela | `100` |
| `CORS_ORIGIN` | Origens permitidas (vírgula) | `http://localhost:5173` |

---

## 📡 Endpoints da API

> Prefixo global: `/api`

### Autenticação
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Login (retorna token JWT) | ❌ |
| POST | `/api/auth/register` | Registro de novo usuário | ❌ |
| GET | `/api/auth/profile` | Perfil do usuário logado | ✅ |

### Dashboard
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/dashboard` | Resumo geral | ✅ |

### Eventos
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/eventos` | Listar (filtros + paginação) | ✅ |
| GET | `/api/eventos/:id` | Detalhes do evento | ✅ |
| POST | `/api/eventos` | Criar evento | ✅ |
| PUT | `/api/eventos/:id` | Atualizar evento | ✅ |
| DELETE | `/api/eventos/:id` | Remover evento | ✅ |

### Participantes
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/participantes` | Listar (filtros + paginação) | ✅ |
| GET | `/api/participantes/:id` | Detalhes | ✅ |
| POST | `/api/participantes` | Cadastrar | ✅ |
| PUT | `/api/participantes/:id` | Atualizar | ✅ |
| DELETE | `/api/participantes/:id` | Remover | ✅ |
| POST | `/api/participantes/:id/transferir` | Transferir para outro evento | ✅ |

### Regras de Check-in
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/eventos/:eventoId/regras-checkin` | Listar regras do evento | ✅ |
| PUT | `/api/eventos/:eventoId/regras-checkin` | Atualizar regras do evento | ✅ |

---

## 📚 Swagger

A documentação interativa está disponível em: **http://localhost:3000/api/docs**

### Como usar:
1. Abra o Swagger
2. Execute `POST /api/auth/login` com as credenciais
3. Copie o `token` retornado
4. Clique em **"Authorize"** (cadeado)
5. Cole: `Bearer <token>`
6. Agora todas as rotas autenticadas funcionam pelo Swagger

---

## 🔒 Segurança

| Recurso | Implementação |
|---|---|
| Autenticação | JWT via Passport com expiração configurável |
| Senha | Hash bcrypt com 12 salt rounds |
| Rotas protegidas | Guard JWT global (todas por padrão) |
| Rotas públicas | Decorator `@Public()` |
| Headers HTTP | Helmet (X-Content-Type, HSTS, CSP, etc.) |
| Rate Limiting | @nestjs/throttler (100 req/60s padrão) |
| CORS | Configurável via variável de ambiente |
| Validação | class-validator com whitelist (rejeita campos desconhecidos) |
| Erros | Padronizados sem expor detalhes internos |

---

## 📐 Regras de negócio — Check-in

A rota `PUT /api/eventos/:id/regras-checkin` aplica as seguintes validações **antes de salvar**:

### 1. Ao menos 1 regra ativa
Se existem regras, pelo menos uma deve estar com `ativo: true`. Caso contrário, o salvamento é bloqueado.

### 2. Conflito de janela de validação
Para regras **obrigatórias e ativas**, calcula-se o intervalo de check-in relativo ao horário do evento:
- `inicio = dataHoraEvento - liberarMinAntes`
- `fim = dataHoraEvento + encerrarMinDepois`

**Conflito detectado** quando dois intervalos de regras obrigatórias ativas **não se intersectam**. Justificativa: se as janelas não têm sobreposição, é impossível para o participante cumprir ambas as regras obrigatórias no mesmo período.

### 3. Nomes únicos
Regras não podem ter nomes duplicados (case-insensitive).

### 4. Limites numéricos
- `liberarMinAntes`: 0 a 1440 (até 24h)
- `encerrarMinDepois`: 0 a 1440 (até 24h)

### 5. Nome mínimo
Mínimo de 3 caracteres.

---

## 🏛 Decisões de arquitetura

| Decisão | Justificativa |
|---|---|
| **NestJS** | Framework robusto com DI, módulos, guards, interceptors, pipes e suporte nativo a Swagger |
| **Prisma** | ORM type-safe com migrações, introspecção e Prisma Studio |
| **PostgreSQL** | Banco relacional robusto; relações Event → Participants, Event → CheckinRules |
| **JWT em Header** | Padrão `Authorization: Bearer <token>` — stateless e compatível com SPA |
| **Guard global** | Inverte a lógica: tudo protegido por padrão, público só com `@Public()` |
| **Filtro global de exceções** | Toda resposta de erro segue o mesmo formato |
| **TransformInterceptor** | Toda resposta de sucesso segue `{ statusCode, data, timestamp }` |
| **Regras de check-in via PUT bulk** | Substitui todas as regras de uma vez (consistência transacional) |
| **Docker Compose** | Facilita setup do PostgreSQL sem instalação local |

---

## 📜 Scripts disponíveis

```bash
npm run start:dev        # Servidor em modo watch
npm run start:prod       # Servidor de produção
npm run build            # Build TypeScript
npm run lint             # ESLint
npm run format           # Prettier
npm run test             # Testes unitários
npm run test:e2e         # Testes end-to-end
npm run prisma:migrate   # Executar migrações
npm run prisma:seed      # Popular banco com dados de exemplo
npm run prisma:studio    # Interface visual do Prisma
npm run docker:up        # Subir PostgreSQL via Docker
npm run docker:down      # Parar PostgreSQL
```
