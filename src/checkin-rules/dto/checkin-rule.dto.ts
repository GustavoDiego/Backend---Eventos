import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  IsOptional,
} from 'class-validator';
import { RuleRequired } from '@prisma/client';

export class CheckinRuleDto {
  @ApiPropertyOptional({
    description: 'ID da regra (obrigatório ao editar, UUID gerado ao criar)',
    example: 'uuid-da-regra',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Nome da regra de check-in',
    example: 'QR Code',
    minLength: 3,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da regra é obrigatório' })
  @MinLength(3, { message: 'Nome da regra deve ter no mínimo 3 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Se a regra está ativa',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'Ativo deve ser um booleano' })
  ativo: boolean;

  @ApiProperty({
    description: 'Obrigatoriedade da regra',
    enum: RuleRequired,
    example: 'OBRIGATORIO',
  })
  @IsEnum(RuleRequired, { message: 'Obrigatoriedade deve ser OBRIGATORIO ou OPCIONAL' })
  obrigatoriedade: RuleRequired;

  @ApiProperty({
    description: 'Minutos antes do evento para liberar check-in (0 a 1440)',
    example: 30,
    minimum: 0,
    maximum: 1440,
  })
  @IsInt({ message: 'liberarMinAntes deve ser um número inteiro' })
  @Min(0, { message: 'liberarMinAntes deve ser >= 0' })
  @Max(1440, { message: 'liberarMinAntes deve ser <= 1440 (1 dia)' })
  liberarMinAntes: number;

  @ApiProperty({
    description: 'Minutos após o evento para encerrar check-in (0 a 1440)',
    example: 60,
    minimum: 0,
    maximum: 1440,
  })
  @IsInt({ message: 'encerrarMinDepois deve ser um número inteiro' })
  @Min(0, { message: 'encerrarMinDepois deve ser >= 0' })
  @Max(1440, { message: 'encerrarMinDepois deve ser <= 1440 (1 dia)' })
  encerrarMinDepois: number;
}
