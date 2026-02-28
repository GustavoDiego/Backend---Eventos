import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({
    description: 'Nome do evento',
    example: 'Expo Tech 2026',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    description: 'Data e hora do evento (ISO 8601)',
    example: '2026-03-15T18:00:00.000Z',
  })
  @IsDateString({}, { message: 'Data/hora deve estar no formato ISO 8601' })
  @IsNotEmpty({ message: 'Data/hora é obrigatória' })
  dataHora: string;

  @ApiProperty({
    description: 'Local do evento',
    example: 'Centro de Convenções - São Paulo',
  })
  @IsString({ message: 'Local deve ser uma string' })
  @IsNotEmpty({ message: 'Local é obrigatório' })
  local: string;

  @ApiProperty({
    description: 'Status do evento',
    enum: EventStatus,
    example: 'ATIVO',
    required: false,
    default: 'ATIVO',
  })
  @IsEnum(EventStatus, { message: 'Status deve ser ATIVO ou ENCERRADO' })
  @IsOptional()
  status?: EventStatus;
}
