import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

// ─── Mock de EventsService ────────────────────────────────────
const mockEventsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// ─── Fixtures ────────────────────────────────────────────────
const EVENT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const eventFixture = {
  id: EVENT_ID,
  nome: 'Expo Tech 2026',
  dataHora: new Date('2026-06-01T18:00:00.000Z'),
  local: 'São Paulo',
  status: 'ATIVO',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const paginatedResult = {
  data: [eventFixture],
  total: 1,
  page: 1,
  pageSize: 10,
};

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [{ provide: EventsService, useValue: mockEventsService }],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deve chamar eventsService.findAll com os filtros recebidos', async () => {
      mockEventsService.findAll.mockResolvedValueOnce(paginatedResult);
      const filters = { page: 1, pageSize: 10 };

      const result = await controller.findAll(filters as never);

      expect(mockEventsService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toBe(paginatedResult);
    });

    it('deve retornar o resultado do service diretamente', async () => {
      mockEventsService.findAll.mockResolvedValueOnce(paginatedResult);

      const result = await controller.findAll({} as never);

      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('deve chamar eventsService.findOne com o id correto', async () => {
      mockEventsService.findOne.mockResolvedValueOnce(eventFixture);

      const result = await controller.findOne(EVENT_ID);

      expect(mockEventsService.findOne).toHaveBeenCalledWith(EVENT_ID);
      expect(result).toBe(eventFixture);
    });
  });

  describe('create', () => {
    it('deve chamar eventsService.create com o DTO recebido', async () => {
      const dto = { nome: 'Expo Tech 2026', dataHora: '2026-06-01T18:00:00.000Z', local: 'SP' };
      mockEventsService.create.mockResolvedValueOnce(eventFixture);

      const result = await controller.create(dto as never);

      expect(mockEventsService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(eventFixture);
    });
  });

  describe('update', () => {
    it('deve chamar eventsService.update com id e DTO corretos', async () => {
      const dto = { nome: 'Expo Tech Atualizado' };
      const updatedEvent = { ...eventFixture, nome: 'Expo Tech Atualizado' };
      mockEventsService.update.mockResolvedValueOnce(updatedEvent);

      const result = await controller.update(EVENT_ID, dto as never);

      expect(mockEventsService.update).toHaveBeenCalledWith(EVENT_ID, dto);
      expect(result).toBe(updatedEvent);
    });
  });

  describe('remove', () => {
    it('deve chamar eventsService.remove com o id correto', async () => {
      mockEventsService.remove.mockResolvedValueOnce({ message: 'Evento removido com sucesso.' });

      const result = await controller.remove(EVENT_ID);

      expect(mockEventsService.remove).toHaveBeenCalledWith(EVENT_ID);
      expect(result).toEqual({ message: 'Evento removido com sucesso.' });
    });
  });
});
