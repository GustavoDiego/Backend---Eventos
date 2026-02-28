import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus } from '@prisma/client';

// ─── Mock do PrismaService ───────────────────────────────────
const mockPrisma = {
  event: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

// ─── Fixtures ────────────────────────────────────────────────
const eventFixture = {
  id: 'uuid-evento-1',
  nome: 'Expo Tech 2026',
  dataHora: new Date('2026-03-15T18:00:00.000Z'),
  local: 'Centro de Convenções SP',
  status: EventStatus.ATIVO,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  // ─── findAll ─────────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar lista paginada vazia quando não há eventos', async () => {
      mockPrisma.$transaction.mockResolvedValueOnce([[], 0]);

      const result = await service.findAll({});

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(0);
    });

    it('deve retornar lista com eventos e meta correta', async () => {
      mockPrisma.$transaction.mockResolvedValueOnce([[eventFixture], 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('deve calcular totalPages corretamente com múltiplas páginas', async () => {
      mockPrisma.$transaction.mockResolvedValueOnce([[], 25]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.meta.totalPages).toBe(3);
    });

    it('deve repassar filtros de busca para o Prisma', async () => {
      mockPrisma.$transaction.mockResolvedValueOnce([[], 0]);

      await service.findAll({ search: 'expo', status: EventStatus.ATIVO });

      // Verifica que a transação foi chamada
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('deve aplicar filtro de período (from e to)', async () => {
      mockPrisma.$transaction.mockResolvedValueOnce([[eventFixture], 1]);

      const result = await service.findAll({
        from: '2026-01-01',
        to: '2026-12-31',
      });

      expect(result.data).toHaveLength(1);
    });

    it('deve aplicar filtro de local', async () => {
      mockPrisma.$transaction.mockResolvedValueOnce([[eventFixture], 1]);

      const result = await service.findAll({ local: 'São Paulo' });

      expect(result.data).toHaveLength(1);
    });
  });

  // ─── findOne ─────────────────────────────────────────────
  describe('findOne', () => {
    it('deve retornar o evento quando encontrado', async () => {
      mockPrisma.event.findUnique.mockResolvedValueOnce(eventFixture);

      const result = await service.findOne('uuid-evento-1');

      expect(result).toEqual(eventFixture);
      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-evento-1' },
        include: expect.objectContaining({
          _count: expect.any(Object),
          regrasCheckin: true,
        }),
      });
    });

    it('deve lançar NotFoundException quando evento não existe', async () => {
      mockPrisma.event.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('uuid-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve incluir code EVENT_NOT_FOUND na exceção', async () => {
      mockPrisma.event.findUnique.mockResolvedValueOnce(null);

      try {
        await service.findOne('uuid-inexistente');
        fail('Deveria ter lançado exceção');
      } catch (err) {
        const response = (err as NotFoundException).getResponse() as Record<string, unknown>;
        expect(response.code).toBe('EVENT_NOT_FOUND');
      }
    });
  });

  // ─── create ──────────────────────────────────────────────
  describe('create', () => {
    it('deve criar e retornar o evento', async () => {
      mockPrisma.event.create.mockResolvedValueOnce(eventFixture);

      const result = await service.create({
        nome: 'Expo Tech 2026',
        dataHora: '2026-03-15T18:00:00.000Z',
        local: 'Centro de Convenções SP',
      });

      expect(result).toEqual(eventFixture);
      expect(mockPrisma.event.create).toHaveBeenCalledTimes(1);
    });

    it('deve usar status ATIVO como padrão quando não informado', async () => {
      mockPrisma.event.create.mockResolvedValueOnce(eventFixture);

      await service.create({
        nome: 'Evento Sem Status',
        dataHora: '2026-03-15T18:00:00.000Z',
        local: 'Local Qualquer',
      });

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ status: 'ATIVO' }),
      });
    });

    it('deve usar o status informado quando presente', async () => {
      const encerrado = { ...eventFixture, status: EventStatus.ENCERRADO };
      mockPrisma.event.create.mockResolvedValueOnce(encerrado);

      const result = await service.create({
        nome: 'Evento Encerrado',
        dataHora: '2025-01-01T10:00:00.000Z',
        local: 'Local',
        status: EventStatus.ENCERRADO,
      });

      expect(result.status).toBe(EventStatus.ENCERRADO);
    });
  });

  // ─── update ──────────────────────────────────────────────
  describe('update', () => {
    it('deve atualizar e retornar o evento modificado', async () => {
      const atualizado = { ...eventFixture, nome: 'Novo Nome' };
      mockPrisma.event.findUnique.mockResolvedValueOnce(eventFixture);
      mockPrisma.event.update.mockResolvedValueOnce(atualizado);

      const result = await service.update('uuid-evento-1', { nome: 'Novo Nome' });

      expect(result.nome).toBe('Novo Nome');
      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 'uuid-evento-1' },
        data: { nome: 'Novo Nome' },
      });
    });

    it('deve lançar NotFoundException quando evento não existe', async () => {
      mockPrisma.event.findUnique.mockResolvedValueOnce(null);

      await expect(service.update('uuid-inexistente', { nome: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve atualizar dataHora convertendo a string para Date', async () => {
      mockPrisma.event.findUnique.mockResolvedValueOnce(eventFixture);
      mockPrisma.event.update.mockResolvedValueOnce(eventFixture);

      await service.update('uuid-evento-1', { dataHora: '2026-06-01T10:00:00.000Z' });

      const updateCall = mockPrisma.event.update.mock.calls[0][0];
      expect(updateCall.data.dataHora).toBeInstanceOf(Date);
    });
  });

  // ─── remove ──────────────────────────────────────────────
  describe('remove', () => {
    it('deve remover o evento e retornar mensagem de sucesso', async () => {
      mockPrisma.event.findUnique.mockResolvedValueOnce(eventFixture);
      mockPrisma.event.delete.mockResolvedValueOnce(eventFixture);

      const result = await service.remove('uuid-evento-1');

      expect(result.message).toBe('Evento removido com sucesso');
      expect(mockPrisma.event.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-evento-1' },
      });
    });

    it('deve lançar NotFoundException quando evento não existe', async () => {
      mockPrisma.event.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('uuid-inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
