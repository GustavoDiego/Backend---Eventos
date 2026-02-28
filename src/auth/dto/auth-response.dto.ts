import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}

export class UserProfileDto {
  @ApiProperty({ description: 'ID do usuário', example: 'uuid-aqui' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'Administrador' })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'admin@eventos.com' })
  email: string;
}
