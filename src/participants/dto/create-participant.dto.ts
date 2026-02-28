import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { CheckinStatus } from '@prisma/client';

export class CreateParticipantDto {
  @ApiProperty({
    description: 'Nome do participante',
    example: 'Ana Silva',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({
    description: 'E-mail do participante',
    example: 'ana@email.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'ID do evento vinculado',
    example: 'uuid-do-evento',
  })
  @IsUUID('4', { message: 'eventoId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do evento é obrigatório' })
  eventoId: string;

  @ApiPropertyOptional({
    description: 'Status de check-in',
    enum: CheckinStatus,
    example: 'NAO_FEITO',
    default: 'NAO_FEITO',
  })
  @IsEnum(CheckinStatus, { message: 'Check-in deve ser FEITO ou NAO_FEITO' })
  @IsOptional()
  checkin?: CheckinStatus;
}
