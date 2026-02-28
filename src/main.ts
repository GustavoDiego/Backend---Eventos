import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');

  // ── Segurança HTTP ───────────────────────────────────────
  app.use(helmet());

  // ── CORS ──────────────────────────────────────────────────
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Prefixo global da API ────────────────────────────────
  app.setGlobalPrefix('api');

  // ── Validação global (class-validator) ────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Swagger / OpenAPI ─────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API — Sistema de Eventos')
    .setDescription(
      `Backend para o painel do organizador de eventos.

## Funcionalidades
- **Autenticação** — Login/Registro com JWT
- **Eventos** — CRUD completo com filtros e paginação
- **Participantes** — CRUD, filtros, transferência entre eventos
- **Regras de Check-in** — Configuração por evento com validações de negócio
- **Dashboard** — Indicadores e resumo geral

## Segurança
- Todas as rotas (exceto login/registro) exigem token JWT
- Rate limiting ativo para proteção contra brute-force
- Headers de segurança via Helmet

## Autenticação
1. Faça login em \`POST /api/auth/login\`
2. Copie o token retornado
3. Clique em "Authorize" e cole: \`Bearer <token>\``,
    )
    .setVersion('1.0.0')
    .setContact('GustavoDiego', 'https://github.com/GustavoDiego', '')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token JWT obtido no login',
    })
    .addTag('Autenticação', 'Endpoints de login, registro e perfil')
    .addTag('Dashboard', 'Resumo geral do painel')
    .addTag('Eventos', 'CRUD de eventos')
    .addTag('Participantes', 'CRUD de participantes e transferência')
    .addTag('Regras de Check-in', 'Configuração de regras de check-in por evento')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Eventos — Swagger',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { font-size: 2rem; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  // ── Start ─────────────────────────────────────────────────
  await app.listen(port);

  logger.log(`🚀 Servidor rodando em http://localhost:${port}`);
  logger.log(`📚 Swagger disponível em http://localhost:${port}/api/docs`);
}

bootstrap();
