import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

// ─── Mock de DashboardService ─────────────────────────────────
const mockDashboardService = {
  getSummary: jest.fn(),
};

// ─── Fixture ─────────────────────────────────────────────────
const summaryFixture = {
  totalEventos: 5,
  totalParticipantes: 30,
  totalCheckins: 12,
  eventosAtivos: 3,
  proximosEventos: [
    {
      id: 'uuid-1',
      nome: 'Expo Tech',
      dataHora: '2026-06-01T18:00:00.000Z',
      local: 'São Paulo',
    },
  ],
  ultimasAtividades: [
    {
      tipo: 'CHECKIN',
      participante: 'Ana Lima',
      evento: 'Expo Tech',
      em: '2026-05-15T12:00:00.000Z',
    },
  ],
};

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: DashboardService, useValue: mockDashboardService }],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummary', () => {
    it('deve chamar dashboardService.getSummary', async () => {
      mockDashboardService.getSummary.mockResolvedValueOnce(summaryFixture);

      await controller.getSummary();

      expect(mockDashboardService.getSummary).toHaveBeenCalledTimes(1);
      expect(mockDashboardService.getSummary).toHaveBeenCalledWith();
    });

    it('deve retornar o resultado do service diretamente', async () => {
      mockDashboardService.getSummary.mockResolvedValueOnce(summaryFixture);

      const result = await controller.getSummary();

      expect(result).toBe(summaryFixture);
    });

    it('deve retornar os campos esperados do resumo', async () => {
      mockDashboardService.getSummary.mockResolvedValueOnce(summaryFixture);

      const result = await controller.getSummary();

      expect(result).toHaveProperty('totalEventos');
      expect(result).toHaveProperty('totalParticipantes');
      expect(result).toHaveProperty('totalCheckins');
      expect(result).toHaveProperty('eventosAtivos');
      expect(result).toHaveProperty('proximosEventos');
      expect(result).toHaveProperty('ultimasAtividades');
    });

    it('deve retornar dados quando service retorna proximosEventos vazio', async () => {
      const emptyResult = { ...summaryFixture, proximosEventos: [], ultimasAtividades: [] };
      mockDashboardService.getSummary.mockResolvedValueOnce(emptyResult);

      const result = await controller.getSummary();

      expect(result.proximosEventos).toEqual([]);
      expect(result.ultimasAtividades).toEqual([]);
    });
  });
});
