import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ParticipantsModule } from './participants/participants.module';
import { CheckinRulesModule } from './checkin-rules/checkin-rules.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    // ── Configuração ─────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── Rate Limiting (proteção contra brute-force) ──────
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    // ── Módulos do domínio ───────────────────────────────
    PrismaModule,
    AuthModule,
    EventsModule,
    ParticipantsModule,
    CheckinRulesModule,
    DashboardModule,
  ],
  providers: [
    // Guard JWT global — todas rotas protegidas por padrão
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Rate Limiting global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Filtro global de exceções (padroniza erros)
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Interceptor global de resposta (padroniza sucesso)
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
