import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto, FilterEventsDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista eventos com filtros e paginação.
   */
  async findAll(filters: FilterEventsDto) {
    const { search, status, from, to, local, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (search) {
      where.nome = { contains: search, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    if (from || to) {
      where.dataHora = {};
      if (from) where.dataHora.gte = new Date(from);
      if (to) where.dataHora.lte = new Date(to);
    }

    if (local) {
      where.local = { contains: local, mode: 'insensitive' };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dataHora: 'asc' },
        include: {
          _count: { select: { participantes: true, regrasCheckin: true } },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca um evento por ID.
   */
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        _count: { select: { participantes: true, regrasCheckin: true } },
        regrasCheckin: true,
      },
    });

    if (!event) {
      throw new NotFoundException({
        message: `Evento com ID "${id}" não encontrado`,
        code: 'EVENT_NOT_FOUND',
      });
    }

    return event;
  }

  /**
   * Cria um novo evento.
   */
  async create(dto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        nome: dto.nome,
        dataHora: new Date(dto.dataHora),
        local: dto.local,
        status: dto.status || 'ATIVO',
      },
    });

    this.logger.log(`Evento criado: ${event.id} — ${event.nome}`);
    return event;
  }

  /**
   * Atualiza um evento existente.
   */
  async update(id: string, dto: UpdateEventDto) {
    await this.findOne(id); // garante que existe

    const data: Prisma.EventUpdateInput = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.dataHora !== undefined) data.dataHora = new Date(dto.dataHora);
    if (dto.local !== undefined) data.local = dto.local;
    if (dto.status !== undefined) data.status = dto.status;

    const event = await this.prisma.event.update({
      where: { id },
      data,
    });

    this.logger.log(`Evento atualizado: ${event.id} — ${event.nome}`);
    return event;
  }

  /**
   * Remove um evento.
   */
  async remove(id: string) {
    await this.findOne(id); // garante que existe

    await this.prisma.event.delete({ where: { id } });

    this.logger.log(`Evento removido: ${id}`);
    return { message: 'Evento removido com sucesso' };
  }
}
