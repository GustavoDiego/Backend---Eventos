import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateParticipantDto,
  UpdateParticipantDto,
  FilterParticipantsDto,
  TransferParticipantDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ParticipantsService {
  private readonly logger = new Logger(ParticipantsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista participantes com filtros e paginação.
   */
  async findAll(filters: FilterParticipantsDto) {
    const { search, eventoId, checkin, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ParticipantWhereInput = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (eventoId) {
      where.eventoId = eventoId;
    }

    if (checkin) {
      where.checkin = checkin;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.participant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          evento: {
            select: { id: true, nome: true, dataHora: true, status: true },
          },
        },
      }),
      this.prisma.participant.count({ where }),
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
   * Busca um participante por ID.
   */
  async findOne(id: string) {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
      include: {
        evento: {
          select: { id: true, nome: true, dataHora: true, local: true, status: true },
        },
      },
    });

    if (!participant) {
      throw new NotFoundException({
        message: `Participante com ID "${id}" não encontrado`,
        code: 'PARTICIPANT_NOT_FOUND',
      });
    }

    return participant;
  }

  /**
   * Cria um novo participante vinculado a um evento.
   */
  async create(dto: CreateParticipantDto) {
    // Verifica se o evento existe
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventoId },
    });

    if (!event) {
      throw new BadRequestException({
        message: `Evento com ID "${dto.eventoId}" não encontrado`,
        code: 'EVENT_NOT_FOUND',
      });
    }

    const participant = await this.prisma.participant.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        eventoId: dto.eventoId,
        checkin: dto.checkin || 'NAO_FEITO',
      },
      include: {
        evento: {
          select: { id: true, nome: true },
        },
      },
    });

    this.logger.log(`Participante criado: ${participant.id} — ${participant.nome}`);
    return participant;
  }

  /**
   * Atualiza um participante existente.
   */
  async update(id: string, dto: UpdateParticipantDto) {
    await this.findOne(id); // garante que existe

    // Se mudar o evento, verifica se o novo existe
    if (dto.eventoId) {
      const event = await this.prisma.event.findUnique({
        where: { id: dto.eventoId },
      });
      if (!event) {
        throw new BadRequestException({
          message: `Evento com ID "${dto.eventoId}" não encontrado`,
          code: 'EVENT_NOT_FOUND',
        });
      }
    }

    const participant = await this.prisma.participant.update({
      where: { id },
      data: {
        ...(dto.nome !== undefined && { nome: dto.nome }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.eventoId !== undefined && { eventoId: dto.eventoId }),
        ...(dto.checkin !== undefined && { checkin: dto.checkin }),
      },
      include: {
        evento: {
          select: { id: true, nome: true },
        },
      },
    });

    this.logger.log(`Participante atualizado: ${participant.id} — ${participant.nome}`);
    return participant;
  }

  /**
   * Remove um participante.
   */
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.participant.delete({ where: { id } });

    this.logger.log(`Participante removido: ${id}`);
    return { message: 'Participante removido com sucesso' };
  }

  /**
   * Transfere um participante para outro evento.
   */
  async transfer(id: string, dto: TransferParticipantDto) {
    const participant = await this.findOne(id);

    if (participant.eventoId === dto.novoEventoId) {
      throw new BadRequestException({
        message: 'O participante já pertence a este evento',
        code: 'SAME_EVENT_TRANSFER',
      });
    }

    // Verifica se o novo evento existe
    const newEvent = await this.prisma.event.findUnique({
      where: { id: dto.novoEventoId },
    });

    if (!newEvent) {
      throw new BadRequestException({
        message: `Evento destino com ID "${dto.novoEventoId}" não encontrado`,
        code: 'EVENT_NOT_FOUND',
      });
    }

    const updated = await this.prisma.participant.update({
      where: { id },
      data: {
        eventoId: dto.novoEventoId,
        checkin: 'NAO_FEITO', // Reseta check-in ao transferir
      },
      include: {
        evento: {
          select: { id: true, nome: true },
        },
      },
    });

    this.logger.log(
      `Participante ${id} transferido do evento ${participant.eventoId} para ${dto.novoEventoId}`,
    );

    return updated;
  }
}
