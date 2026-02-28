import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckinStatus } from '@prisma/client';

export class FilterParticipantsDto {
  @ApiPropertyOptional({
    description: 'Busca por nome do participante',
    example: 'Ana',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do evento',
    example: 'uuid-do-evento',
  })
  @IsUUID('4')
  @IsOptional()
  eventoId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status de check-in',
    enum: CheckinStatus,
    example: 'NAO_FEITO',
  })
  @IsEnum(CheckinStatus)
  @IsOptional()
  checkin?: CheckinStatus;

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
