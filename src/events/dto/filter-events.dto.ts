import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '@prisma/client';

export class FilterEventsDto {
  @ApiPropertyOptional({
    description: 'Busca por nome do evento',
    example: 'Expo',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: EventStatus,
    example: 'ATIVO',
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiPropertyOptional({
    description: 'Data inicial do período (ISO 8601)',
    example: '2026-01-01',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'Data final do período (ISO 8601)',
    example: '2026-12-31',
  })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por local',
    example: 'São Paulo',
  })
  @IsString()
  @IsOptional()
  local?: string;

  @ApiPropertyOptional({
    description: 'Página atual (paginação)',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Itens por página',
    example: 10,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
