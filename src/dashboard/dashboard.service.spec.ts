import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

// ─── Mock do PrismaService ───────────────────────────────────
const mockPrisma = {
  event: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  participant: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

// ─── Fixtures ────────────────────────────────────────────────
const FUTURE_DATE = new Date('2026-06-01T20:00:00.000Z');

const proximosEventosFixture = [
  { id: 'uuid-1', nome: 'Expo Tech', dataHora: FUTURE_DATE, local: 'São Paulo' },
];

const ultimasAtividadesFixture = [
  {
    nome: 'Ana Lima',
    updatedAt: new Date('2026-05-15T12:00:00.000Z'),
    evento: { nome: 'Expo Tech' },
  },
];

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  describe('getSummary', () => {
    const setupMock = ({
      totalEventos = 5,
      totalParticipantes = 30,
      totalCheckins = 12,
      eventosAtivos = 3,
      proximosEventos = proximosEventosFixture,
      ultimasAtividades = ultimasAtividadesFixture,
    } = {}) => {
      mockPrisma.$transaction.mockResolvedValueOnce([
        totalEventos,
        totalParticipantes,
        totalCheckins,
        eventosAtivos,
        proximosEventos,
        ultimasAtividades,
      ]);
    };

    it('deve retornar os totais corretos', async () => {
      setupMock({ totalEventos: 5, totalParticipantes: 30, totalCheckins: 12, eventosAtivos: 3 });

      const result = await service.getSummary();

      expect(result.totalEventos).toBe(5);
      expect(result.totalParticipantes).toBe(30);
      expect(result.totalCheckins).toBe(12);
      expect(result.eventosAtivos).toBe(3);
    });

    it('deve mapear proximosEventos com dataHora como ISO string', async () => {
      setupMock({ proximosEventos: proximosEventosFixture });

      const result = await service.getSummary();

      expect(result.proximosEventos).toHaveLength(1);
      expect(result.proximosEventos[0]).toEqual({
        id: 'uuid-1',
        nome: 'Expo Tech',
        dataHora: FUTURE_DATE.toISOString(),
        local: 'São Paulo',
      });
    });

    it('deve mapear ultimasAtividades com tipo CHECKIN e campo em como ISO string', async () => {
      setupMock({ ultimasAtividades: ultimasAtividadesFixture });

      const result = await service.getSummary();

      expect(result.ultimasAtividades).toHaveLength(1);
      expect(result.ultimasAtividades[0]).toEqual({
        tipo: 'CHECKIN',
        participante: 'Ana Lima',
        evento: 'Expo Tech',
        em: ultimasAtividadesFixture[0].updatedAt.toISOString(),
      });
    });

    it('deve retornar arrays vazios quando não há dados', async () => {
      setupMock({
        totalEventos: 0,
        totalParticipantes: 0,
        totalCheckins: 0,
        eventosAtivos: 0,
        proximosEventos: [],
        ultimasAtividades: [],
      });

      const result = await service.getSummary();

      expect(result.totalEventos).toBe(0);
      expect(result.proximosEventos).toEqual([]);
      expect(result.ultimasAtividades).toEqual([]);
    });

    it('deve chamar $transaction exatamente uma vez', async () => {
      setupMock();

      await service.getSummary();

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('deve mapear múltiplas atividades na ordem correta', async () => {
      const atividades = [
        {
          nome: 'Carlos',
          updatedAt: new Date('2026-05-15T13:00:00.000Z'),
          evento: { nome: 'Evento B' },
        },
        {
          nome: 'Maria',
          updatedAt: new Date('2026-05-15T12:00:00.000Z'),
          evento: { nome: 'Evento A' },
        },
      ];
      setupMock({ ultimasAtividades: atividades });

      const result = await service.getSummary();

      expect(result.ultimasAtividades[0].participante).toBe('Carlos');
      expect(result.ultimasAtividades[1].participante).toBe('Maria');
      expect(result.ultimasAtividades[0].tipo).toBe('CHECKIN');
    });
  });
});
