import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransferParticipantDto {
  @ApiProperty({
    description: 'ID do novo evento para transferência',
    example: 'uuid-do-novo-evento',
  })
  @IsUUID('4', { message: 'novoEventoId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'ID do novo evento é obrigatório' })
  novoEventoId: string;
}
