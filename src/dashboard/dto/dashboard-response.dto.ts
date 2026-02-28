import { ApiProperty } from '@nestjs/swagger';

class ProximoEventoDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Expo Tech' })
  nome: string;

  @ApiProperty({ example: '2026-03-01T18:00:00.000Z' })
  dataHora: string;

  @ApiProperty({ example: 'Centro de Convenções' })
  local: string;
}

class UltimaAtividadeDto {
  @ApiProperty({ example: 'CHECKIN' })
  tipo: string;

  @ApiProperty({ example: 'Ana Silva' })
  participante: string;

  @ApiProperty({ example: 'Expo Tech' })
  evento: string;

  @ApiProperty({ example: '2026-02-27T13:10:00.000Z' })
  em: string;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Total de eventos cadastrados', example: 12 })
  totalEventos: number;

  @ApiProperty({ description: 'Total de participantes cadastrados', example: 384 })
  totalParticipantes: number;

  @ApiProperty({ description: 'Total de check-ins realizados', example: 150 })
  totalCheckins: number;

  @ApiProperty({ description: 'Eventos ativos', example: 8 })
  eventosAtivos: number;

  @ApiProperty({
    description: 'Próximos eventos (até 5)',
    type: [ProximoEventoDto],
  })
  proximosEventos: ProximoEventoDto[];

  @ApiProperty({
    description: 'Últimas atividades de check-in (até 10)',
    type: [UltimaAtividadeDto],
  })
  ultimasAtividades: UltimaAtividadeDto[];
}
