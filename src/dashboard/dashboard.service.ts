import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna resumo do dashboard:
   * - Total de eventos e participantes
   * - Total de check-ins realizados
   * - Eventos ativos
   * - Próximos eventos (até 5)
   * - Últimas atividades (participantes com check-in feito, até 10)
   */
  async getSummary() {
    const now = new Date();

    const [
      totalEventos,
      totalParticipantes,
      totalCheckins,
      eventosAtivos,
      proximosEventos,
      ultimasAtividades,
    ] = await this.prisma.$transaction([
      // Total de eventos
      this.prisma.event.count(),

      // Total de participantes
      this.prisma.participant.count(),

      // Total de check-ins realizados
      this.prisma.participant.count({
        where: { checkin: 'FEITO' },
      }),

      // Eventos ativos
      this.prisma.event.count({
        where: { status: 'ATIVO' },
      }),

      // Próximos eventos (data futura, até 5)
      this.prisma.event.findMany({
        where: {
          dataHora: { gte: now },
          status: 'ATIVO',
        },
        select: { id: true, nome: true, dataHora: true, local: true },
        orderBy: { dataHora: 'asc' },
        take: 5,
      }),

      // Últimas atividades (participantes com check-in feito, mais recentes)
      this.prisma.participant.findMany({
        where: { checkin: 'FEITO' },
        select: {
          nome: true,
          updatedAt: true,
          evento: { select: { nome: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalEventos,
      totalParticipantes,
      totalCheckins,
      eventosAtivos,
      proximosEventos: proximosEventos.map((e) => ({
        id: e.id,
        nome: e.nome,
        dataHora: e.dataHora.toISOString(),
        local: e.local,
      })),
      ultimasAtividades: ultimasAtividades.map((p) => ({
        tipo: 'CHECKIN',
        participante: p.nome,
        evento: p.evento.nome,
        em: p.updatedAt.toISOString(),
      })),
    };
  }
}
