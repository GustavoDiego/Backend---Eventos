import { Test, TestingModule } from '@nestjs/testing';
import { CheckinRulesController } from './checkin-rules.controller';
import { CheckinRulesService } from './checkin-rules.service';
import { RuleRequired } from '@prisma/client';

// ─── Mock de CheckinRulesService ─────────────────────────────
const mockCheckinRulesService = {
  findByEvent: jest.fn(),
  updateByEvent: jest.fn(),
};

// ─── Fixtures ────────────────────────────────────────────────
const EVENTO_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const rulesResult = {
  regras: [
    {
      id: 'uuid-rule-1',
      nome: 'QR Code',
      ativo: true,
      obrigatoriedade: RuleRequired.OBRIGATORIO,
      liberarMinAntes: 30,
      encerrarMinDepois: 60,
      eventoId: EVENTO_ID,
    },
  ],
};

describe('CheckinRulesController', () => {
  let controller: CheckinRulesController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckinRulesController],
      providers: [{ provide: CheckinRulesService, useValue: mockCheckinRulesService }],
    }).compile();

    controller = module.get<CheckinRulesController>(CheckinRulesController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findByEvent', () => {
    it('deve chamar checkinRulesService.findByEvent com o eventoId correto', async () => {
      mockCheckinRulesService.findByEvent.mockResolvedValueOnce(rulesResult);

      const result = await controller.findByEvent(EVENTO_ID);

      expect(mockCheckinRulesService.findByEvent).toHaveBeenCalledWith(EVENTO_ID);
      expect(result).toBe(rulesResult);
    });

    it('deve retornar o resultado do service diretamente', async () => {
      mockCheckinRulesService.findByEvent.mockResolvedValueOnce(rulesResult);

      const result = await controller.findByEvent(EVENTO_ID);

      expect(result).toEqual(rulesResult);
    });
  });

  describe('updateByEvent', () => {
    it('deve chamar checkinRulesService.updateByEvent com eventoId e DTO corretos', async () => {
      const dto = {
        regras: [
          {
            nome: 'QR Code',
            ativo: true,
            obrigatoriedade: RuleRequired.OBRIGATORIO,
            liberarMinAntes: 30,
            encerrarMinDepois: 60,
          },
        ],
      };
      mockCheckinRulesService.updateByEvent.mockResolvedValueOnce(rulesResult);

      const result = await controller.updateByEvent(EVENTO_ID, dto as never);

      expect(mockCheckinRulesService.updateByEvent).toHaveBeenCalledWith(EVENTO_ID, dto);
      expect(result).toBe(rulesResult);
    });

    it('deve retornar o resultado do service diretamente', async () => {
      const dto = { regras: [] };
      mockCheckinRulesService.updateByEvent.mockResolvedValueOnce({ regras: [] });

      const result = await controller.updateByEvent(EVENTO_ID, dto as never);

      expect(result).toEqual({ regras: [] });
    });
  });
});
